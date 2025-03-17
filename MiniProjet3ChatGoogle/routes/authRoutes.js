const passport = require('passport');

// Routes d'authentification

module.exports = app => {


    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']  // Le scope inclut 'profile' et 'email'
        })
    );


    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
        (req, res) => {
            //console.log("Nouvel utilisateur connecté : ", req.user); // Vérifie que l'utilisateur est bien dans req.user
            res.redirect('http://localhost:8080');
        }
    );


    app.get('/auth/logout', (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err); // Si une erreur se produit, elle est envoyée au middleware d'erreur
            }
            req.session.destroy(() => {
                res.redirect('http://localhost:8080');
            });
        });
    });



// Récupérer l'utilisateur connecté


    app.get('/api/current_user', (req, res) => {
        //console.log('current_user');
        //console.log('req.session:', req.session);  // Vérifie le contenu de la session
        //console.log('req.user:', req.user);  // Vérifie si l'utilisateur est bien attaché
        res.send(req.user);
    });
}