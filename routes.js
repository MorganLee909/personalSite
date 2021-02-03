const home = require("./controllers/home.js");
const finance = require("./controllers/finance.js");

module.exports = function(app){
    app.get("/", home.renderMain);
    app.get("/jeopardy", home.renderJeopardy);
    app.get("/sudoku", home.sudoku);
    app.get("/birthdayparadox", home.birthdayParadox);
    app.get("/resume", home.resume);
    app.get("/bio", home.bio);
    
    app.post("/jeopardy/question/create", home.createQuestion);
    app.post("/jeopardy/questions", home.getQuestions);

    // app.get("/corona/compare", home.coronaCompare);
    // app.get("/corona/us/*", home.coronaUS);
    // app.get("/corona/json", home.coronaData);
    // app.get("/corona*", home.corona);

    //FINANCE
    app.get("/finance", finance.enter);
    app.post("/finance/register", finance.register);
    app.post("/finance/login", finance.login);
    app.get("/finance/dashboard", finance.dashboard);
    app.post("/finance/user", finance.getUser);
    app.post("/finance/account", finance.createAccount);
    app.post("/finance/transaction", finance.createTransaction);
    app.get("/finance/account/:id", finance.getAccount);
    app.delete("/finance/account/:id", finance.deleteAccount);
    app.post("/finance/category", finance.createCategory);
    app.post("/finance/bill", finance.createBill);
    app.post("/finance/income", finance.createIncome);
    app.post("/finance/allowance", finance.createAllowance);
    app.delete("/finance/transaction/:id", finance.deleteTransaction);
    app.delete("/finance/category/:account/:name/:type", finance.deleteCategory);
}