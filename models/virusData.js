const mongoose = require("mongoose");

const VirusDataSchema = new mongoose.Schema({
    SNo: Number,
    ObservationDate: String,
    "Province/State": String,
    "Country/Region": String,
    "Last Update": String,
    Confirmd: Number,
    Deaths: Number,
    Recovered: Number
});

module.exports = mongoose.model("overallData", CoronaVirusSchema, "overallData");