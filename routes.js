const home = require("./controllers/home.js");

module.exports = function(app){
    app.get("/", home.renderMain);
    app.get("/jeopardy", home.renderJeopardy);
    app.get("/sudoku", home.sudoku);
    app.get("/birthdayparadox", home.birthdayParadox);
    app.get("/resume", home.resume);
    app.get("/bio", home.bio);
    
    app.post("/jeopardy/question/create", home.createQuestion);
    app.post("/jeopardy/questions", home.getQuestions);

    app.get("/corona/compare", home.coronaCompare);
    app.get("/corona/us/*", home.coronaUS);
    app.get("/corona/json", home.coronaData);
    app.get("/corona*", home.corona);
    
}