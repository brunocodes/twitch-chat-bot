const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchecma = new Schema({
    active: Boolean,
    alerts_active: Boolean,
    sub_alert: Boolean,
    resub_alert: Boolean,
    giftsub_alert: Boolean,
    raid_alert: Boolean,
    host_alert: Boolean,
});

const channelSchema = new Schema({
	channel_name: {
		type: String,
		required: true
    },
    channel_id: {
        type: String,
		required: true
    },
    date_created: {
		type: Date,
		default: Date.now
	},
    settings: {
        type: settingsSchecma,
        default: {
            active: true,
            alerts_active: true,
            sub_alert: true,
            resub_alert: true,
            giftsub_alert: false,
            raid_alert: true,
            host_alert: false,
        }        
    }
});

module.exports = Channel = mongoose.model('channel', channelSchema);