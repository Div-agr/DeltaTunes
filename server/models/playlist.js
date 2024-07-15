const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: String,
  isPublic: Boolean,
  songs: Array,
  image: String,
  email: String,
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = Playlist;
