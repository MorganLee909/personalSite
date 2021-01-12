const User = require("../classes/user.js");

const homePage = {
    display: function(){
        if(state.user === null){
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
                .then(async (response)=>{
                    state.user = new User(
                        response._id,
                        response.accounts,
                        response.account
                    );

                    state.homePage.newData = true;

                    if(response.accounts.length === 0){
                        controller.openPage("createAccountPage");
                    }else{
                        await state.user.changeAccount(state.user.accounts[0]);

                        this.populateData();
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });

            document.getElementById("createAccountBtn").onclick = ()=>{controller.openPage("createAccountPage")};
            document.getElementById("createTransactionBtn").onclick = ()=>{controller.openPage("createTransactionPage")};
        }else if(state.homePage.newData === true){
            this.populateData();
        }
    },

    populateData: function(){
        let transactions = document.getElementById("transactions");
        while(transactions.children.length > 0){
            transactions.removeChild(transactions.firstChild);
        }

        for(let i = 0; i < state.user.account.transactions.length; i++){
            let transaction = document.createElement("transaction-comp");
            transaction.setAttribute("date", state.user.account.transactions[i].date);
            transaction.setAttribute("amount", state.user.account.transactions[i].amount);
            transactions.appendChild(transaction);
        }

        state.homePage.newData = false;
    }
}

module.exports = homePage;