const tmi = require('tmi.js');
const fs = require('fs');
const { prefix } = require('./config.json');
const commandList = require('./commands/commands');
const Command  = require('../models/Command');
const Channel = require('../models/Channel');
const Cooldowns = require('./Cooldowns.js');
require('dotenv').config();

const channelList = [ process.env.CHANNEL_USER_NAME  ]; 
const opts = {  
	connection: {
		reconnect: true,
		secure: true
	},
  identity: {
    username: process.env.BOT_USER_NAME,
    password: process.env.PASS_OAUTH
  },
  channels: channelList
}

const client = new tmi.client(opts);
client.connect().catch(console.error);
const cooldowns = new Cooldowns();

client.on('message', (channel, userstate, msg, self)=> {  
  if (self) { return; } // Ignore messages from the bot
  // commands and inputs
  const commandArray = msg.trim().split(' ');  
  const commandName = commandArray[0].toLowerCase();
  
  const checkIfIsCommand = (command) => {    
    const n = command.search(prefix);
    if (n == 0) {
      return true;
    } else {
      return false;
    }
  }
  const getResponseString = ( lengthAmount, message) => {
    const result = message.substring(lengthAmount)
    return result;
  }
  //isBroadcaster
  const checkIfBroadcaster = (userstate)=> {
    if (userstate['room-id'] !== userstate['user-id']) {
      return false;      
    } else if (userstate['room-id'] === userstate['user-id']) {
      return true;
    }
  }
  const isBroadcaster = checkIfBroadcaster(userstate);  
  // isSub true or false
  const isSub = userstate.subscriber;
  const isMod = userstate.mod || isBroadcaster;
  // isVIP    
  const checkIfVIP = (userstate)=> {
    if ( isBroadcaster || userstate.badges === null ) {
      return false;      
    } else if (userstate.badges.vip === '1') {
      return true;
    }
  }
  const isVIP = checkIfVIP(userstate);
  // Variables  //
  const botName = process.env.BOT_USER_NAME_DISPLAY;
  const userName = `${userstate['display-name']}`;
  const userID = `${userstate['user-id']}`;
  // const mentionUser = `@${userstate['display-name']}`;
  // const firstInput = commandArray[1];  // const secondInput = commandArray[2];  // const thirdInput = commandArray[3];  // const forthInput = commandArray[4];  
  
  const isCommand = checkIfIsCommand(commandName);
  if (isCommand) {
    commandList.map(command=> {
      if(command.name === commandName && command.active) {

        if (!cooldowns.has(command.name)) {
          cooldowns.set(command.name, new Cooldowns());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (!timestamps.has(userID)) {

          if(command.modOnly && isMod) {
            if(command.hasArgs) {
              const commandsArg = getResponseString(commandArray[0].length + commandArray[1].length + commandArray[2].length + 3, msg)
              command.execute(client , channel, userstate, commandArray, commandsArg);
            } else {
              command.execute(client , channel , userstate);
            }
          } else if(!command.modOnly) {
            if(command.hasArgs) {
              command.execute(client , channel, userstate, commandArray );
            } else {
              command.execute(client , channel , userstate);
            }
          }
          timestamps.set(userID, now);
          setTimeout(() => timestamps.delete(userID), cooldownAmount);          
        }
      }
    });
    try {
      const channelID = userstate['room-id'];
      Command.find({channel_id: channelID},(err, commandObj)=> {
        let commandArray =  [];
        for (const command in commandObj) {        
          if (Object.hasOwnProperty.call(commandObj, command)) {
              const currentCommand = commandObj[command];
              commandArray.push(currentCommand._doc)
          }
        }
        if (commandArray.length > 0) {
          commandArray.map((commDB)=> {
            const currentCommand = commandName.substring(1);
            if (commDB.command_name === currentCommand) {
              if (!cooldowns.has(commandName)) {
                cooldowns.set(commandName, new Cooldowns());
              }
              const now = Date.now();
              const timestamps = cooldowns.get(commandName);
              const cooldownAmount = (commDB.cooldown || 3) * 1000;
              if (!timestamps.has(userID)) {
                if(commDB.mod_only && isMod) {
                  client.say(channel, `${commDB.response}`);
                  timestamps.set(userID, now);
                  setTimeout(() => timestamps.delete(userID), cooldownAmount);
                } else if(!commDB.mod_only) {
                  client.say(channel, `${commDB.response}`);
                  timestamps.set(userID, now);
                  setTimeout(() => timestamps.delete(userID), cooldownAmount);
                }
              }
            }
          }); 
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
});
// New sub
client.on("subscription", (channel, username, method, message, userstate) => {
  try {
    const channelID = userstate['room-id'];
    Channel.findOne({channel_id: channelID},(err, channelObj)=> {
      if (!err) {
        if(channelObj) {
          if(channelObj.settings.resub_alert) {
            client.say(channel, `@${username} thank you for subscribing <3`);
          }
        }   
      }
    })
  } catch (error) {
    console.log(error);
  }
});

// Resub
client.on("resub", (channel, username, months, message, userstate, methods) => {  
  try {
    const cumulativeMonths = userstate["msg-param-cumulative-months"];
    const channelID = userstate['room-id'];
    Channel.findOne({channel_id: channelID},(err, channelObj)=> {
      if (!err) {
        if(channelObj) {
          if(channelObj.settings.resub_alert) {
            client.say(channel, `@${username} thank you for resubscribing for ${cumulativeMonths} months <3`);
          }
        }      
      }
    })
  } catch (error) {
    console.log(error);
  }
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
  try {
    const channelID = userstate['room-id'];
    Channel.findOne({channel_id: channelID},(err, channelObj)=> {
      if (!err) {
        if(channelObj) {
          if(channelObj.settings.giftsub_alert) {
            client.say(channel, `${userstate["system-msg"]}`);
          }
        }      
      }
    })
  } catch (error) {
    console.log(error);
  }
});

client.on("raided", (channel, username, viewers) => {  
  try {
    const channelName = channel.substring(1);
    Channel.findOne({channel_name: channelName},(err, channelObj)=> {
      if (!err) {
        if(channelObj) {
          if(channelObj.settings.raid_alert) {
            client.say(channel, `${username} has raided with a party of ${viewers}!`);
          }
        }      
      }
    })
  } catch (error) {
    console.log(error);
  }
});

client.on("hosted", (channel, username, viewers, autohost) => {  
  try {
    const channelName = channel.substring(1);
    Channel.findOne({channel_name: channelName},(err, channelObj)=> {
      if (!err) {
        if(channelObj) {
          if(channelObj.settings.host_alert) {
            client.say(channel, `@${username} Thanks for the ${viewers} viewer host!`);
          }
        }      
      }
    })
  } catch (error) {
    console.log(error);
  }
});

// Called every time the bot connects to Twitch chat
client.on('connected', (addr, port)=> {
  console.log(`* Connected to ${addr}:${port}`);
});