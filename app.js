const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");

const app = express();

mongoose.connect(process.env.PERSONAL_SITE, {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(compression());

require("./routes")(app);

app.listen(process.env.PORT, ()=>{});