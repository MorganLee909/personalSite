const home = require("./controllers/home.js");

module.exports = function(app){
    app.get("/", home.renderMain);
    app.get("/jeopardy", home.renderJeopardy);
    app.get("/sudoku", home.sudoku);
    app.get("/birthdayparadox", home.birthdayParadox);
    app.get("/corona*", home.corona);
    app.get("/resume", home.resume);
    app.get("/bio", home.bio);
    
    app.post("/jeopardy/question/create", home.createQuestion);
    app.post("/jeopardy/questions", home.getQuestions);
}