const JeopardySet = require("../models/jeopardySet");
const MongoClient = require("mongodb").MongoClient;

let Corona = {};
let Comment = {};

MongoClient.connect(
    process.env.PERSONAL_SITE, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err, client)=>{
        let db = client.db("corona");
        Corona = db.collection("worldData");
        Comment = db.collection("comments");
    }
);

module.exports = {
    //GET - Renders the landing page
    renderMain: function(req, res){
        return res.render("homePage/home");
    },

    //GET - Shows the jeopardy page
    renderJeopardy: async function(req, res){
        JeopardySet.aggregate([{$sample: {size: 6}}])
            .then((sets)=>{
                return res.render("jeopardyPage/jeopardy", {sets: sets});
            })
            .catch((err)=>{
                return res.redirect("/");
            });
    },

    //GET - Shows the sudoku solver page
    sudoku: function(req, res){
        return res.render("sudokuPage/sudoku");
    },

    //GET - Shows the birthday paradox page
    birthdayParadox: function(req, res){
        return res.render("birthdayParadoxPage/birthdayParadox");
    },

    //GET - Shows the CCP Corona Virus page
    corona: function(req, res){
        let location = req.url.slice(req.url.indexOf("corona") + 7);
        switch(location){
            case "us": location = "United_States_of_America"; break;
            case "china": location = "China"; break;
            case "taiwan": location = "Taiwan"; break;
            case "canada": location = "Canada"; break;
            case "russia": location = "Russia"; break;
            default: location = "";
        }

        if(location.length === 0){
            Corona.aggregate([
                {$group: {
                    _id: {
                        year: "$year",
                        month: "$month",
                        day: "$day"
                    },
                    cases: {$sum: "$cases"},
                    deaths: {$sum: "$deaths"}
                }},
                {$sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1
                }},
                {$project: {
                    _id: 0,
                    countryterritoryCode: 1,
                    date: {$toDate: {$concat: [{$toString: "$_id.year"}, "-", {$toString: "$_id.month"}, "-", {$toString: "$_id.day"}]}},
                    newCases: "$cases",
                    newDeaths: "$deaths"
                }}
            ]).toArray()
            .then((data)=>{
                Comment.find().toArray()
                    .then((comments)=>{
                        return res.render("coronaPage/corona", {data: data, comments: comments})
                    })
                    .catch((err)=>{});
            })
            .catch((err)=>{});
        }else{
            Corona.aggregate([
                {$match: {
                    countriesAndTerritories: location,
                }},
                {$group: {
                    _id: {
                        year: "$year",
                        month: "$month",
                        day: "$day"
                    },
                    cases: {$sum: "$cases"},
                    deaths: {$sum: "$deaths"}
                }},
                {$sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1
                }},
                {$project: {
                    _id: 0,
                    countryterritoryCode: 1,
                    date: {$toDate: {$concat: [{$toString: "$_id.year"}, "-", {$toString: "$_id.month"}, "-", {$toString: "$_id.day"}]}},
                    newCases: "$cases",
                    newDeaths: "$deaths"
                }}
            ]).toArray()
            .then((data)=>{
                Comment.find().toArray()
                    .then((comments)=>{
                        return res.render("coronaPage/corona", {data: data, comments: comments})
                    })
                    .catch((err)=>{});
            })
            .catch((err)=>{});
        }
    },

    //GET - Renders the resume page
    resume: function(req, res){
        return res.render("resumePage/resume");
    },

    bio: function(req, res){
        return res.render("bioPage/bio");
    },

    //POST - Create a new jeopardy question
    //inputs:
    //  req.body.title: string
    //  req.body.category: category name
    //  req.body.questions: list of objects(question, answer)
    createQuestion: function(req, res){
        let question = new JeopardySet({
            title: req.body.title,
            category: req.body.category,
            questions: req.body.questions
        });

        question.save()
            .then((question)=>{
                return res.json({});
            })
            .catch((err)=>{
                return res.json("Error: The question could not be created");
            });
    },

    //POST - Get questions to choose from
    //inputs:
    //  req.body.category: category to choose questions from
    //returns:
    //  sets: up to 30 sets of questions
    getQuestions: function(req, res){
        if(req.body.category === ""){
            JeopardySet.aggregate([{$sample: {size: 30}}])
                .then((sets)=>{
                    return res.json(sets);
                })
                .catch((err)=>{
                    return res.json("Error: Could not retrieve sets");
                });
        }else{
            JeopardySet.aggregate([
                {$match: {category: req.body.category}},
                {$sample: {size: 30}}
            ])
                .then((sets)=>{
                    return res.json(sets);
                })
                .catch((err)=>{
                    return res.json("Error: Could not retrieve sets");
                });
        }
    }
}