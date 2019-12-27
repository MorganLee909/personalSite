const home = require("./controllers/home.js");

module.exports = function(app){
    app.get("/", home.renderMain);
    app.get("/jeopardy", home.renderJeopardy);

    app.post("/jeopardy/question/create", home.createQuestion);
}