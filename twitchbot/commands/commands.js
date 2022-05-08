const fetch = require('node-fetch');

module.exports = [
    {
        name: "!config",
        active: true,
        modOnly: true,
        hasArgs: false,
        cooldown: 5,
        execute(client, channel, userstate) {
            const channelID = userstate['room-id'];
            const channelName = channel.substring(1);
            const configPayload = {
                channelID,
                channelName
            };
            try {
                fetch('http://localhost:5555/api/v1/user/channelconfig', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(configPayload)
                })
                .then(res => {
                    if (res.status === 200) return res.json();                    
                })
                .then(res => {                    
                    if (res.message) {
                        client.say(channel, `${res.message}`);
                    }
                })
            } catch (error) {
                console.log(error);
                client.say(channel, `Error runing full test MrDestructoid`);
            }
        }
    },
    {
        name: "!c0mmands",
        active: true,
        modOnly: true,
        hasArgs: true,
        cooldown: 1,
        execute(client, channel, userstate, args, response) {
            const channelID = userstate['room-id'];            
            if (!args[2]) {
                client.say(channel, `Missing args`)
            } else if (args[1] && args[2]) {
                if (args[1] == "add") {
                    const channelID = userstate['room-id'];
                    const commandName = args[2].substring(1);
                    const addPayload = {
                        channel_id: channelID,
                        name: commandName,
                        response: response                        
                    };
                    try {
                        fetch('http://localhost:5555/api/v1/command/addcommand', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(addPayload)
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                client.say(channel, `@${userstate['display-name']} The command "${args[2]}" has been added successfully.`)
                            };
                        })
                    } catch (error) {
                        console.log(error);
                        client.say(channel, `Error adding command "${args[2]}"`);
                    }
                } else if(args[1] == "edit") {
                    try {
                        const commandName3 = args[2].substring(1);
                        const editPayload = {
                            name: commandName3, 
                            channel_id: channelID,
                            response: response
                        };
                        fetch('http://localhost:5555/api/v1/command/editcommand', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(editPayload)
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                client.say(channel, `@${userstate['display-name']} The command "${args[2]}" was been edited successfully.`);
                            };
                        })                        
                    } catch (error) {
                        client.say(channel, `Error editing command "${args[2]}"`);
                    }
                    
                } else if(args[1] == "delete") {
                    const commandName2 = args[2].substring(1);
                    const deletePayload = {
                        name: commandName2, 
                        channel_id: channelID                        
                    };
                    try {
                        fetch('http://localhost:5555/api/v1/command/delcommand', {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(deletePayload)
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                client.say(channel, `@${userstate['display-name']} The command "${args[2]}" was been deleted successfully.`);
                            };
                        })
                    } catch (error) {
                        client.say(channel, `Error deleteing command "${args[2]}"`);
                    }
                }
            } 
        }
    },
    {
        name: "!ping",
        active: true,
        modOnly: false,
        hasArgs: false,
        cooldown: 5,
        execute(client, channel) {
            client.say(channel, `This is a ping!`)
        }
    },
    {
        name: "!modonly",
        active: true,
        modOnly: true,
        hasArgs: false,
        cooldown: 1,
        execute(client, channel) {
            client.say(channel, `This is a Mod Only command :p!`)
        }
    },
    {
        name: "!coinflip",
        active: true,
        modOnly: false,
        hasArgs: false,
        cooldown: 5,
        execute(client, channel) {
            const coinFlip = ()=> {
                const sides = 2;
                let num = Math.floor(Math.random() * sides) + 1;
                if (num == 1) {
                  return num = 'Heads';
                } else if (num == 2) {
                  return num = 'Tails';
                }
            }
            const result = coinFlip();
            client.say(channel, `You have flipped a ${result}`);
        }
    },
    {
        name: "!dice",
        active: true,
        modOnly: false,
        hasArgs: false,
        cooldown: 5,
        execute(client, channel) {
            const rollDice = ()=> {
                const sides = 6;
                return Math.floor(Math.random() * sides) + 1;
            }
            const result = rollDice();
            client.say(channel, `You have rolled a ${result}`);
        }
    }
];