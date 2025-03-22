const passport = require('passport');
const { register, login } = require('../controllers/authController');
// Routes d'authentification

module.exports = app => {


    app.post('/api/register', register);
    app.post('/api/login', login);

    app.get('/auth/discord', passport.authenticate('discord'));

    app.get('/auth/discord/callback', passport.authenticate('discord', {
        failureRedirect: '/auth/discord/failure'
    }), function(req, res) {
        res.redirect('http://localhost:8080') // Successful auth
    });


    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']  // Le scope inclut 'profile' et 'email'
        })
    );


    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
        (req, res) => {
            res.redirect('http://localhost:8080');
        }
    );


    app.get('/auth/logout', (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.session.destroy(() => {
                res.redirect('http://localhost:8080');
            });
        });
    });



// Récupérer l'utilisateur connecté


    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
}