const JeopardySet = require("../models/jeopardySet");
const MongoClient = require("mongodb").MongoClient;

let Corona, CoronaCounty, PopData;

MongoClient.connect(
    process.env.PERSONAL_SITE, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err, client)=>{
        let db = client.db("corona");
        Corona = db.collection("worldData");
        CoronaCounty = db.collection("usCounties");
        PopData = db.collection("countyPop");
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
            case "ukraine": location = "Ukraine"; break;
            case "kazakhstan": location = "Kazakhstan"; break;
            case "sweden": location = "Sweden"; break;
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
                    deaths: {$sum: "$deaths"},
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
                    newDeaths: "$deaths",
                }}
            ]).toArray()
            .then((data)=>{
                for(let point of data){
                    point.population = 7643000000;
                }
                return res.render("coronaPage/corona", {data: data});
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
                    deaths: {$sum: "$deaths"},
                    population: {$avg: "$popData2018"}
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
                    newDeaths: "$deaths",
                    population: 1
                }}
            ]).toArray()
            .then((data)=>{
                return res.render("coronaPage/corona", {data: data});
            })
            .catch((err)=>{});
        }
    },

    coronaUS: function(req, res){
        let location = req.url.slice(req.url.indexOf("us/") + 3).replace("?", "");
        let newArray = location.split("/");
        let state = "";
        let county = "";

        let stateArr = newArray[0].split("-");
        for(let str of stateArr){
            state += str[0].toUpperCase() + str.slice(1);
            state += " ";
        }
        if(state[state.length - 1] === " "){
            state = state.slice(0, state.length - 1);
        }
        
        if(newArray.length === 2){
            let countyArr = newArray[1].split("-");
            for(let str of countyArr){
                county += str[0].toUpperCase() + str.slice(1);
                county += " ";
            }
            if(county[county.length - 1] === " "){
                county = county.slice(0, county.length - 1);
            }
        }

        console.log(county);
        if(county){
            let countyData = {}
            CoronaCounty.aggregate([
                {$match: {
                    state: state,
                    county: county
                }},
                {$addFields: {date: {$toDate: "$date"}}},
                {$sort: {date: 1}},
                {$project: {
                    _id: 0,
                    date: 1,
                    newCases: "$cases",
                    newDeaths: "$deaths"
                }}
            ]).toArray()
            .then((response)=>{
                countyData = response;

                return PopData.aggregate([
                    {$match: {
                        STNAME: state,
                        CTYNAME: `${county} County`
                    }},
                    {$project: {
                        _id: 0,
                        population: "$POPESTIMATE2019"
                    }}
                ]).toArray()
            })
            .then((response)=>{
                if(countyData.length === 0){
                    return res.redirect("/corona/us");
                }

                for(let i = countyData.length - 1; i > 0; i--){
                    countyData[i].newCases -= countyData[i-1].newCases;
                    countyData[i].newDeaths -= countyData[i-1].newDeaths;
                }

                return res.render("coronaPage/corona", {data: countyData, population: response});
            })
            .catch((err)=>{});
        }else{
            let stateData = {};

            CoronaCounty.aggregate([
                {$match: {state: state}},
                {$group: {
                    _id: {
                        state: "$state",
                        date: "$date"
                    },
                    newCases: {$sum: "$cases"},
                    newDeaths: {$sum: "$deaths"}
                }},
                {$addFields: {date: {$toDate: "$_id.date"}}},
                {$sort: {date: 1}},
                {$project: {
                    _id: 0,
                    date: 1,
                    newCases: 1,
                    newDeaths: 1
                }}
            ]).toArray()
            .then((response)=>{
                stateData = response;
                return PopData.aggregate([
                    {$match: {
                        STNAME: state,
                        CTYNAME: state
                    }},
                    {$project: {
                        _id: 0,
                        population: "$POPESTIMATE2019"
                    }}
                ]).toArray()
            })
            .then((response)=>{
                if(stateData.length === 0){
                    return res.redirect("/corona/us");
                }
                for(let i = stateData.length - 1; i > 0; i--){
                    stateData[i].newCases -= stateData[i-1].newCases;
                    stateData[i].newDeaths -= stateData[i-1].newDeaths;
                }

                return res.render("coronaPage/corona", {data: stateData, population: response});
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
    },

    coronaCompare: function(req, res){
        let countryData = Corona.aggregate([
            {$group: {
                _id: "$countriesAndTerritories",
                totalCases: {$sum: "$cases"},
                totalDeaths: {$sum: "$deaths"},
                population: {$avg: "$popData2018"}
            }},
            {$project: {
                _id: 0,
                name: "$_id",
                totalCases: 1,
                totalDeaths: 1,
                population: 1
            }}
        ]).toArray();

        let stateData = CoronaCounty.aggregate([
            {$group: {
                _id: {
                    state: "$state",
                    date: "$date"
                },
                totalCases: {$sum: "$cases"},
                totalDeaths: {$sum: "$deaths"},
            }},
            {$group: {
                _id: {
                    state: "$_id.state",
                },
                doc: {$max: {
                    date: {$toDate: "$_id.date"}, 
                    name: "$_id.state", 
                    totalCases: {$sum: "$totalCases"},
                    totalDeaths: {$sum: "$totalDeaths"}
                }},
            }},
            {$replaceRoot: {newRoot: "$doc"}}
          ]).toArray();

        let populationData = PopData.aggregate([
            {$match: {
                COUNTY: 0
            }},
            {$project: {
                _id: 0,
                STNAME: 1,
                POPESTIMATE2019: 1
            }}
        ]).toArray();

        Promise.all([countryData, stateData, populationData])
            .then((response)=>{
                console.log(response[1][0]);
                for(let i = 0; i < response[1].length; i++){
                    let isMatch = false;
                    for(let j = 0; j < response[2].length; j++){
                        if(response[1][i].name === response[2][j].STNAME){
                            response[1][i].population = response[2][j].POPESTIMATE2019;
                            isMatch = true;
                        }
                    }

                    if(!isMatch){
                        response[1].splice(i, 1);
                        i--;
                    }
                }

                let data = {
                    countries: response[0],
                    states: response[1],
                }

                return res.render("coronaPage/compare", {data: data});
            })
            .catch((err)=>{});
    }
}