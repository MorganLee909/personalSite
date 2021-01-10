const homePage = require("./pages/home.js");

const User = require("./classes/user.js");
const Account = require("./classes/account.js");
const Transaction = require("./classes/transaction.js");
const Item = require("./classes/item.js");

controller = {
    changePage: function(page){
        let pages = document.querySelectorAll(".page");

        for(let i = 0; i < pages.length; i++){
            page.style.display = "none";
        }

        document.getElementById(page).style.display = "flex";

        switch(page){
            case "homePage":
                homePage.display();
                break;
        }
    }
}

state = {
    user: {},
    homePage: {
        isPopulated: false,
        newData: false
    }
}

homePage.display();