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

                        this.populateTransactions();
                        this.populateStats();
                        this.populateIncome();
                    }
                })
                .catch((err)=>{});

            document.getElementById("createAccountBtn").onclick = ()=>{controller.openPage("createAccountPage")};
            document.getElementById("createTransactionBtn").onclick = ()=>{controller.openPage("createTransactionPage")};
            document.getElementById("createCategoryBtn").onclick = ()=>{controller.openPage("createCategoryPage")};
            document.getElementById("createBillBtn").onclick = ()=>{controller.openPage("createBillPage")};
            document.getElementById("createIncomeBtn").onclick = ()=>{controller.openPage("createIncomePage")};
        }else if(state.homePage.newData === true){
            this.populateTransactions();
            this.populateStats();
            this.populateIncome();
        }
    },

    populateTransactions: function(){
        let transactions = document.getElementById("transactionsBody");
        while(transactions.children.length > 0){
            transactions.removeChild(transactions.firstChild);
        }

        state.user.account.sortTransactions("date");

        for(let i = 0; i < state.user.account.transactions.length; i++){
            let tr = document.createElement("tr");
            tr.onclick = ()=>{controller.openPage("transactionPage", state.user.account.transactions[i])};
            tr.classList.add("transaction");

            let date = document.createElement("td");
            date.innerText = state.user.account.transactions[i].dateString("short");
            date.classList.add("mainTd");
            tr.appendChild(date);

            let category = document.createElement("td");
            category.innerText = state.user.account.transactions[i].category;
            category.classList.add("mainTd");
            tr.appendChild(category);

            let location = document.createElement("td");
            location.innerText = state.user.account.transactions[i].location;
            location.classList.add("mainTd");
            tr.appendChild(location);

            let amount = document.createElement("td");
            amount.innerText = state.user.account.transactions[i].amountString();
            amount.classList.add("mainTd");
            tr.appendChild(amount);

            transactions.appendChild(tr);
        }

        state.homePage.newData = false;
    },

    populateStats: function(){
        document.getElementById("totalDiscretionary").innerText = state.user.account.discretionary();
        document.getElementById("remainingDiscretionary").innerText = state.user.account.remainingDiscretionary();
        document.getElementById("totalIncome").innerText = state.user.account.incomeTotal();
        document.getElementById("totalBills").innerText = state.user.account.billTotal();
        document.getElementById("title").innerText = `${state.user.account.name} Account`;
    },

    populateIncome: function(){
        let tbody = document.getElementById("incomeBody");
        console.log("things");

        for(let i = 0; i < state.user.account.income.length; i++){
            //Check if already paid first
            let isPaid = "No";
            for(let j = 0; j < state.user.account.transactions.length; j++){
                if(state.user.account.transactions[j].category === state.user.account.income[i].name){
                    isPaid = "Yes";
                }
            }

            let tr = document.createElement("tr");
            tbody.appendChild(tr);

            let name = document.createElement("td");
            name.innerText = state.user.account.income[i].name;
            name.classList.add("subTd");
            tr.appendChild(name);

            let amount = document.createElement("td");
            amount.innerText = state.user.account.income[i].amount;
            amount.classList.add("subTd");
            tr.appendChild(amount);

            let paid = document.createElement("td");
            paid.innerText = isPaid;
            paid.classList.add("subTd");
            tr.appendChild(paid);

            let remove = document.createElement("td");
            remove.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            remove.classList.add("subTd");
            remove.onclick = ()=>{this.removeCategory(state.user.account.income[i])};
            tr.appendChild(remove);
        }
    },

    removeCategory: function(thing){
        console.log(thing.name);
    }
}

module.exports = homePage;