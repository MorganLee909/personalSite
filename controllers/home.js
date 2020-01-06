const JeopardySet = require("../models/jeopardySet");

module.exports = {
    renderMain: function(req, res){
        return res.render("homePage/home");
    },

    renderJeopardy: async function(req, res){
        JeopardySet.aggregate([{$sample: {size: 6}}])
            .then((sets)=>{
                return res.render("jeopardyPage/jeopardy", {sets: sets});
            })
            .catch((err)=>{
                return res.redirect("/");
            });
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
    }
}