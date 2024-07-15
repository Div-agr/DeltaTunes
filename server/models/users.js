const mongoose = require('mongoose');
const {ObjectId}= mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  playlists: Array,
  followers:[{type:ObjectId, ref:"User"}],
  following:[{type:ObjectId, ref:"User"}]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
