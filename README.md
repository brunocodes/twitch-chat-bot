# Twitch Chat Bot
Twitch chat bot using tmi.js, node.js, ExpressJS and MongoDB.
### Alpha v0.0.3:
Module commands(Hard coded commands) and Custom commands(Commands from a datebase)
* Custom commands - !c0mmands add/edit/delete 
* Module commands - !dice, !coinflip 
##  Installation
```bash
git clone https://github.com/budthepit/bud_the_bot.git
cd bud_the_bot
npm install
```
## Add .env file and add OAuth and channal names database link
```bash 
BOT_USER_NAME=botname
BOT_USER_NAME_DISPLAY=BotName
PASS_OAUTH=
CHANNEL_USER_NAME=
DATABASE_LINK=
PORT=5555

```
## Start 
```bash 
npm run start 
```