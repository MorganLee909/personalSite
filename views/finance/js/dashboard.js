const homePage = require("./home.js");

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
    homePage: {
        isPopulated: false,
        newData: false
    }
}

homePage.display();