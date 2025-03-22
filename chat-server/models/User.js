const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: { type: String },
    displayName: { type: String, unique: true }, // Unique pour éviter les doublons
    encryptedPassword: { type: String }
});

const User = mongoose.model('users', userSchema);
module.exports = User;
