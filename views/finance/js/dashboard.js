const homePage = require("./pages/home.js");
const createAccountPage = require("./pages/createAccount.js");

controller = {
    openPage: function(page){
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
        }
    }
}

state = {
    user: null,
    homePage: {
        newData: true
    }
}

homePage.display();