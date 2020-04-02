const JeopardySet = require("../models/jeopardySet");

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

    corona: function(req, res){
        return res.render("coronaPage/corona");
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