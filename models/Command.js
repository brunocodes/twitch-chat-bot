const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commandSchema = new Schema({
  command_name: String,
  channel_id: String,
  response: String,    
  cooldown: Number,    
  args: Boolean,
  mod_only: Boolean,
  vip_only: Boolean,
  usage: {
    type: Number,
    default: 0
  },
  date_created: {
    type: Date,
    default: Date.now
	}
});

module.exports = command = mongoose.model('command', commandSchema);