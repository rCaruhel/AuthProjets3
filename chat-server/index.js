require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const { createClient } = require('redis');
const cors = require('cors');
const app = express();
const RedisStore = require('connect-redis').default;
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const Message = require('./models/Message');


// Apply CORS middleware before other middleware and routes
app.use(cors({
    origin: 'http://localhost:8080', // Your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));





mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.error(err));

// Connexion à Redis
const redisClient = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });
redisClient.connect().catch(console.error);

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:8080", credentials: true }
});

app.use(bodyParser.json());

// Sessions avec Redis
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());




redisClient.on('connect', () => {
    console.log('✅ Connecté à Redis');
});

redisClient.on('error', (err) => {
    console.error('❌ Erreur Redis :', err);
});

require('./services/passport');
require('./models/User');
require('./models/Message');
require('./routes/authRoutes')(app);

const connectedUsers = new Set();

io.on('connection', (socket) => {
    console.log('Nouvel utilisateur connecté');

    socket.on('message', async (data) => {
        try {
            const message = new Message({ sender: data.pseudo, text: data.text });
            await message.save(); // Sauvegarde dans MongoDB

            // Ajout du message dans Redis (Mise à jour du cache)
            const cacheKey = 'messages';
            const cachedMessages = await redisClient.get(cacheKey);
            let messages = cachedMessages ? JSON.parse(cachedMessages) : [];

            messages.unshift(message); // Ajoute le nouveau message au début de la liste

            await redisClient.setEx(cacheKey, CACHE_EXPIRATION, JSON.stringify(messages));

            console.log("🟢 Message ajouté dans MongoDB et Redis !");

            io.emit('message', message); // Envoi du message aux clients connectés
        } catch (error) {
            console.error("❌ Erreur lors de l'envoi du message :", error);
        }
    });

    // Enregistrement d'un nouvel utilisateur
    socket.on('registerUser', (userName) => {
        socket.userName = userName;
        connectedUsers.add(userName);
        io.emit('userList', Array.from(connectedUsers));
    });

    // Gestion de la déconnexion d'un utilisateur
    socket.on('disconnect', () => {
        if (socket.userName) {
            connectedUsers.delete(socket.userName);
            io.emit('userList', Array.from(connectedUsers));
        }
    });
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

const CACHE_EXPIRATION = 500;

// Route pour récupérer les messages depuis Redis
app.get('/messages/redis', async (req, res) => {
    try {
        const cacheKey = 'messages';
        const cachedMessages = await redisClient.get(cacheKey);

        if (cachedMessages) {
            console.log("Données récupérées depuis Redis !");
            return res.json(JSON.parse(cachedMessages));
        }

        console.log("Aucun message en cache Redis.");
        res.status(404).json({ message: "Aucun message en cache" });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des messages Redis :', error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route pour récupérer les messages depuis MongoDB
app.get('/messages/mongodb', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });

        // Mettre en cache pour optimiser la prochaine requête Redis
        const cacheKey = 'messages';
        await redisClient.setEx(cacheKey, CACHE_EXPIRATION, JSON.stringify(messages));

        console.log("Données récupérées depuis MongoDB et mises en cache !");
        res.json(messages);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des messages MongoDB :', error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


app.use((err, req, res) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});