const JeopardySet = require("../models/jeopardyCategory");

module.exports = {
    renderMain: function(req, res){
        return res.render("homePage/home");
    },

    renderJeopardy: function(req, res){
        JeopardySet.find()
            .limit(6)
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
    //  req.body.questions: list of objects(question, answer)
    createQuestion: function(req, res){
        let question = new JeopardyCategory({
            title: req.body.title,
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