const home = require("./controllers/home.js");

module.exports = function(app){
    app.get("/", home.renderMain);
    app.get("/jeopardy", home.renderJeopardy);
    app.get("/sudoku", home.sudoku);
    app.get("/birthdayparadox", home.birthdayParadox);
    app.get("/resume", home.resume);

    app.post("/jeopardy/question/create", home.createQuestion);
    app.post("/jeopardy/questions", home.getQuestions);
}