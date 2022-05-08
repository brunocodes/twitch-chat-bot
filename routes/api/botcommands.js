const router = require('express').Router();
const User = require('../../models/User');
const Command = require('../../models/Command');

// @route   POST /getcommand
// @desc    Get an array of all the users
// @access  Public
router.post('/getcommand', (req, res) => {
    try {
        const channelID = req.body.channel_id;
        const commandName = req.body.name;
        Command.findOne({channel_id: channelID, command_name: commandName}, (err, commandRes)=>{
            if(!err) {
                if (commandRes) {
                    res.json({
                        command: commandRes.command
                    })
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
});

// @route   POST /newuser
// @desc    Register new user
// @access  Public
router.post('/addcommand', (req, res) => {
    const channelID = req.body.channel_id;
    const commandName = req.body.name;
    const response = req.body.response;
    try {
        Command.findOne({command_name: commandName, channel: channelID}, (err, commandRes)=> {
            if (!err) {
                if (!commandRes) {
                    new Command({
                        channel_id: channelID,
                        command_name: commandName,
                        response: response,
                        cooldown: 5,
                        args: false,
                        mod_only: false,
                        vip_only: false
                    }).save().then(()=> {
                        res.status(200).send('Command added')
                    });
                } else {
                    res.status(404).send('Command Allready exists')
                }
            } 
        })
    } catch (error) {
        res.status(404).send('Error adding command.')
    }
});

// @route   POST /newuser
// @desc    Register new user
// @access  Public
router.post('/editcommand', (req, res) => {
    const channelID = req.body.channel_id;
    const commandName = req.body.name;    
    const response = req.body.response;
    try {
        Command.updateOne(
            {command_name: commandName, channel_id: channelID},
            { $set: {       
                response: response
            }},
            (err)=> {
              if(err) {}
            }
        ).then(()=> {
            res.status(200).send('Command added')
        })
    } catch (error) {
        res.status(404).send('Error editing command.')
    }
});

// @route   DELETE /enduser
// @desc    Delete user from Database
// @access  Public
router.delete('/delcommand', (req, res) => {
    const channelID = req.body.channel_id;
    const commandName = req.body.name;    
    try {
        Command.deleteOne({command_name: commandName, channel_id: channelID})
        .then(()=> {
            res.status(200).send('Command added')
        });
    } catch (error) {
        res.status(404).send('Error deleteing command.')
    }
});

module.exports = router;