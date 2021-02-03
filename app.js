const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const session = require("cookie-session");
const https = require("https");
const fs = require("fs");

const app = express();

mongoose.connect(`${process.env.DB}/personal-site`, {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");

let httpsServer = {};
let forceHttps = ()=>{};
if(process.env.NODE_ENV === "production"){
    forceHttps = (req, res, next)=>{
        if(req.secure){
            next();
        }else{
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    }

    httpsServer = https.createServer({
        key: fs.readFileSync("/etc/letsencrypt/live/www.leemorgan.io/privkey.pem", "utf8"),
        cert: fs.readFileSync("/etc/letsencrypt/live/www.leemorgan.io/fullchain.pem", "utf8")
    }, app);

    app.use(forceHttps);
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
    httpsServer.listen(process.env.HTTPS_PORT, ()=>{});
}

app.listen(process.env.PORT, ()=>{});