const express = require("express");
const mongoose = require('mongoose');
require('dotenv').config();
require('../twitchbot/twitchBot');

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_LINK , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(()=> console.log("MongoDB Connected..."))
.catch((err)=> console.log(err));

// API Use Routes
app.use("/api/v1/user", require('../routes/api/botuser'));
app.use("/api/v1/command", require('../routes/api/botcommands'));

const port = process.env.PORT || 5555;
app.listen(port, () => console.log(`server started on port ${port}`));