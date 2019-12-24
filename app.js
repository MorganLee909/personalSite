const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost/PersonalSite", {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

require("./routes")(app);

app.listen(process.env.PORT, ()=>{
    console.log(`Listening on port ${process.env.PORT}`);
});