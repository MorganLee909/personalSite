require("./components/backButton.js");

const homePage = require("./pages/home.js");
const createAccountPage = require("./pages/createAccount.js");
const createTransactionPage = require("./pages/createTransaction.js");
const createCategoryPage = require("./pages/createCategory.js");
const createBillPage = require("./pages/createBill.js");
const createIncomePage = require("./pages/createIncome.js");
const transactionPage = require("./pages/transaction.js");
const createAllowancePage = require("./pages/createAllowance.js");

controller = {
    openPage: function(page, data){
        let pages = document.querySelectorAll(".page");

        for(let i = 0; i < pages.length; i++){
            pages[i].style.display = "none";
        }

        document.getElementById(page).style.display = "flex";

        switch(page){
            case "homePage":
                homePage.display();
                break;
            case "createAccountPage":
                createAccountPage.display();
                break;
            case "createTransactionPage":
                createTransactionPage.display();
                break;
            case "createCategoryPage":
                createCategoryPage.display();
                break;
            case "createBillPage":
                createBillPage.display();
                break;
            case "createIncomePage":
                createIncomePage.display();
                break;
            case "createAllowancePage":
                createAllowancePage.display();
                break;
            case "transactionPage":
                transactionPage.display(data);
                break;
        }
    }
}

state = {
    user: null,
    homePage: {
        newData: true
    },
    createTransactionPage: {
        newCategories: true
    }
}

homePage.display();