const User = require("../classes/user.js");

const homePage = {
    display: function(){
        if(state.user === undefined){
            let from = new Date();
            from.setDate(0);
            from.setHours(0, 0, 0, 0);

            fetch("/finance/user", {
                method: "post",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: JSON.stringify({from: from, to: new Date()})
            })
                .then(response => response.json())
                .then((response)=>{
                    if(response.accounts.length === 0){
                        controller.openPage("createAccountPage");
                    }else{
                        state.user = new User(
                            response._id,
                            response.accounts,
                            response.account
                        );

                        state.homePage.newData = true;
                    };
                })
                .catch((err)=>{});
        }

        if(state.homePage.newData === true){}
    }
}

module.exports = homePage;