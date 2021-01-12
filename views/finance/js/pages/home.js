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
                .catch((err)=>{});

            document.getElementById("createAccountBtn").onclick = ()=>{controller.openPage("createAccountPage")};
            document.getElementById("createTransactionBtn").onclick = ()=>{controller.openPage("createTransactionPage")};
            document.getElementById("createCategoryBtn").onclick = ()=>{controller.openPage("createCategoryPage")};
        }else if(state.homePage.newData === true){
            this.populateData();
        }
    },

    populateData: function(){
        let transactions = document.getElementById("transactionsBody");
        while(transactions.children.length > 0){
            transactions.removeChild(transactions.firstChild);
        }

        state.user.account.sortTransactions("date");

        for(let i = 0; i < state.user.account.transactions.length; i++){
            let tr = document.createElement("tr");
            tr.classList.add("transaction");

            let date = document.createElement("td");
            date.innerText = state.user.account.transactions[i].dateString();
            tr.appendChild(date);

            let category = document.createElement("td");
            category.innerText = state.user.account.transactions[i].category;
            tr.appendChild(category);

            let location = document.createElement("td");
            location.innerText = state.user.account.transactions[i].location;
            tr.appendChild(location);

            let amount = document.createElement("td");
            amount.innerText = state.user.account.transactions[i].amountString();
            tr.appendChild(amount);

            transactions.appendChild(tr);
        }

        state.homePage.newData = false;
    }
}

module.exports = homePage;