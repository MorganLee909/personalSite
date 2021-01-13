const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const session = require("cookie-session");
const https = require("https");
const fs = require("fs");

const app = express();

mongoose.connect(process.env.PERSONAL_DB, {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");

const httpsServer = {};
if(process.env.NODE_ENV === "production"){
    app.get('*', (req, res) => {
        res.redirect('https://' + req.headers.host + req.url);
    });

    httpsServer = https.createServer({
        key: fs.readFileSync("/etc/letsencrypt/live/www.leemorgan.io/privkey.pem", "utf8"),
        cert: fs.readFileSync("/etc/letsencrypt/live/www.leemorgan.io/fullchain.pem", "utf8")
    }, app);
}

app.use(session({
    secret: "jibberty jabberty go fuck yourself",
    cookie: {secure: true},
    saveUninitialized: true,
    resave: false
}));
app.use(express.static(__dirname + "/views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(compression());

require("./routes")(app);

if(process.env.NODE_ENV === "production"){
    httpsServer.listen(process.env.PORT, ()=>{});
}else{
    app.listen(process.env.PORT, ()=>{});
}