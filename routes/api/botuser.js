const router = require('express').Router();
const User = require('../../models/User');
const Channel = require('../../models/Channel');

// @route   POST /channelconfig
// @desc    Register new user
// @access  Public
router.post('/channelconfig', (req, res) => {    
    const channelID = req.body.channelID;
    const channel = req.body.channelName;
    try {
        Channel.findOne({channel_id: channelID}, (err, channelRes)=> {
            if (!err) {
                if (channelRes) {
                    res.json({message: "Channel database allready existed."})
                } else {
                    try {
                        new Channel({
                            channel_name: channel,
                            channel_id: channelID
                        }).save()
                        .then(()=> {
                            res.json({message: "Channel database created."})
                        })
                    } catch (error) {}
                }
            }
        })
    } catch (error) {
        console.log(error);
        res.json({message: "There was an Error."})
    }
});

// @route   GET /getuserlist
// @desc    Get an array of all the users
// @access  Public
router.get('/getuserlist', (req, res) => {
    User.find({})
        .then( userList =>  {
            console.log("triggered userList ");            
            const DBUserArryList = [];
            userList.map( user => {
                DBUserArryList.push(user.name);
            });
            res.send(DBUserArryList); 
        });
});

// @route   POST /newuser
// @desc    Register new user
// @access  Public
router.post('/newuser', (req, res) => {
    User.findOne({name: req.body.name})
        .then( user => {
            if(user) {
                return res.status(418).json({ msg: 'User allready exists' })
            };
            console.log('* New user added to the database');
            const newUser = new User({
                name: req.body.name,
                mod: req.body.mod,
                broadcaster: req.body.broadcaster
            });
            newUser.save();
        })
        .catch(error => {
            console.log(error);
        });    
});

// @route   DELETE /enduser
// @desc    Delete user from Database
// @access  Public
router.delete('/enduser', (req, res) => {
    User.deleteOne({ name: req.query.name }, (err) => {
        if (err) { console.log(err) };
    });    
});

module.exports = router;