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
                state.user.addAccount(response._id);
                state.user.changeAccount(new Account(
                    response._id,
                    response.name,
                    response.bills,
                    response.income,
                    response.categories,
                    []
                ));

                controller.openPage("homePage");
            })
            .catch((err)=>{});
    }
}

module.exports = createAccount;