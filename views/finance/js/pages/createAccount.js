const Account = require("../classes/account");

const createAccount = {
    display: function(){
        document.getElementById("createAccountForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        fetch("/finance/account", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({name: document.getElementById("createAccountName").value})
        })
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    banner.createBanner(response, "error");
                }else{
                    state.user.addAccount({
                        id: response._id,
                        name: response.name
                    });
                    
                    state.user.changeAccount(new Account(
                        response._id,
                        response.name,
                        response.balance,
                        response.bills,
                        response.income,
                        response.categories,
                        0,
                        []
                    ));

                    state.homePage.newData = true;
                    controller.openPage("homePage");
                }
            })
            .catch((err)=>{
                banner.createError("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE.", "error");
            });
    }
}

module.exports = createAccount;