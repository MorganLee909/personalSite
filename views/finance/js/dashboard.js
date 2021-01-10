const homePage = require("./pages/home.js");

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
        }
    }
}

state = {
    user: undefined,
    homePage: {
        newData: true
    }
}

homePage.display();