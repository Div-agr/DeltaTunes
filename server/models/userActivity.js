const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserActivitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  genre: { type: String, required: true },
  artistName: { type: String, required: true },
  language: { type: String, required: true },
  listenedAt: { type: Date, required: true }
});

const UserActivity = mongoose.model('UserActivity', UserActivitySchema);
module.exports = UserActivity;
