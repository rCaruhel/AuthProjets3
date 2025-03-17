require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

// Assure-toi que le modèle est bien enregistré avant de l'utiliser
require('../models/User');
const User = mongoose.model('users');




passport.serializeUser((user, done) => {
    console.log("serializeUser - User:", user); // Log du user pour vérifier
    done(null, user.id); // On envoie uniquement l'ID dans la session
});

passport.deserializeUser((id, done) => {
    console.log("deserializeUser - ID:", id); // Log de l'ID reçu
    User.findById(id).then(user => {
        console.log("deserializeUser - User:", user); // Log de l'utilisateur récupéré
        done(null, user); // On attache l'utilisateur à la session
    }).catch(err => {
        console.error('Erreur dans deserializeUser:', err);
        done(err, null);
    });
});

// services/passport.js

passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            //console.log('Google profile:', profile);
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {

                //console.log('Existing user:', existingUser);
                return done(null, existingUser);
            }
            const user = await new User({
                googleId: profile.id,
                displayName: profile.displayName
            }).save();
            done(null, user);
        } catch (err) {
            console.error('Error in GoogleStrategy:', err);
            done(err, null);
        }
    }
));