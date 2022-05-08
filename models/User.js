const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({      
      user_name: {
            type: String,
            required: true
      },
      twitch_id: {
            type: String,
            required: true
      },
      channel_name: {
            type: String,
            required: true
      },
      channel_id: {
            type: String,
            required: true
      },
      points: {
            type: Number,
            default: 0
      }
});

module.exports = User = mongoose.model('user', userSchema);