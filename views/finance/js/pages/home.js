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
                    if(typeof(response) === "string"){
                        controller.createBanner(response, "error");
                    }else{
                        state.homePage.newData = true;

                        if(response.accounts.length === 0){
                            state.user = new User(
                                response._id,
                                response.accounts
                            );

                            controller.openPage("createAccountPage");
                        }else{
                            state.user = new User(
                                response._id,
                                response.accounts,
                                response.account
                            );

                            this.populateTransactions();
                            this.populateStats();
                            this.populateIncome();
                            this.populateBills();
                            this.populateAllowances();
                            this.populateCategories();
                        }
                    }
                })
                .catch((err)=>{
                    controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
                });

            document.getElementById("deleteAccount").onclick = ()=>{this.deleteAccount()};
            document.getElementById("createAccountBtn").onclick = ()=>{controller.openPage("createAccountPage")};
            document.getElementById("createTransactionBtn").onclick = ()=>{controller.openPage("createTransactionPage")};
            document.getElementById("createCategoryBtn").onclick = ()=>{controller.openPage("createCategoryPage")};
            document.getElementById("createBillBtn").onclick = ()=>{controller.openPage("createBillPage")};
            document.getElementById("createIncomeBtn").onclick = ()=>{controller.openPage("createIncomePage")};
            document.getElementById("createAllowanceBtn").onclick = ()=>{controller.openPage("createAllowancePage")};
        }else if(state.homePage.newData === true){
            this.populateTransactions();
            this.populateStats();
            this.populateIncome();
            this.populateBills();
            this.populateAllowances();
            this.populateCategories();
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
        document.getElementById("balance").innerText = `BALANCE: $${state.user.account.balance}`;

        let now = new Date();
        document.getElementById("totalDiscretionary").innerText = state.user.account.discretionary();
        document.getElementById("remainingDiscretionary").innerText = state.user.account.remainingDiscretionary();
        document.getElementById("totalIncome").innerText = state.user.account.incomeTotal();
        document.getElementById("totalBills").innerText = state.user.account.billTotal();
        document.getElementById("title").innerText = `${state.user.account.name} Account`;
        document.getElementById("monthLabel").innerText = now.toLocaleDateString("en-US", {month: "long"});

        //add accounts to selector
        let selector = document.getElementById("accountSelector");
        selector.onchange = ()=>{state.user.changeAccount(selector.value)};

        if(state.user.accounts.length <= 1){
            selector.style.display = "none";
        }else{
            selector.style.display = "block";

            while(selector.children.length > 0){
                selector.removeChild(selector.firstChild);
            }

            let option = document.createElement("option");
            option.innerText = "Accounts";
            option.selected = true;
            option.disabled = true;
            selector.appendChild(option);

            for(let i = 0; i < state.user.accounts.length; i++){
                if(state.user.accounts[i].id !== state.user.account.id){
                    let option = document.createElement("option");
                    option.innerText = state.user.accounts[i].name;
                    option.value = state.user.accounts[i].id;
    
                    selector.appendChild(option);
                }
            }
        }
    },

    populateIncome: function(){
        let tbody = document.getElementById("incomeBody");

        while(tbody.children.length > 0){
            tbody.removeChild(tbody.firstChild);
        }

        for(let i = 0; i < state.user.account.income.length; i++){
            //Check if already recieved first
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
            amount.innerText = `$${state.user.account.income[i].amount.toFixed(2)}`;
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
            remove.classList.add("actionable");
            remove.onclick = ()=>{this.removeCategory(state.user.account.income[i], "income")};
            tr.appendChild(remove);
        }
    },

    populateBills: function(){
        let tbody = document.getElementById("billsBody");
        

        while(tbody.children.length > 0){
            tbody.removeChild(tbody.firstChild);
        }

        for(let i = 0; i < state.user.account.bills.length; i++){
            //Check if already paid first
            let isPaid = "No";
            for(let j = 0; j < state.user.account.transactions.length; j++){
                if(state.user.account.transactions[j].category === state.user.account.bills[i].name){
                    isPaid = "Yes";
                }
            }

            let tr = document.createElement("tr");
            tbody.appendChild(tr);

            let name = document.createElement("td");
            name.innerText = state.user.account.bills[i].name;
            name.classList.add("subTd");
            tr.appendChild(name);

            let amount = document.createElement("td");
            amount.innerText = `$${state.user.account.bills[i].amount.toFixed(2)}`;
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
            remove.classList.add("actionable");
            remove.onclick = ()=>{this.removeCategory(state.user.account.bills[i], "bills")};
            tr.appendChild(remove);
        }
    },

    populateAllowances: function(){
        let tbody = document.getElementById("allowanceBody");

        while(tbody.children.length > 0){
            tbody.removeChild(tbody.firstChild);
        }

        for(let i = 0; i < state.user.account.allowances.length; i++){
            let allowanceSpent = state.user.account.getAllowanceSpent(state.user.account.allowances[i].name);
            let incomeTotal = state.user.account.incomeTotal();

            let tr = document.createElement("tr");
            tbody.appendChild(tr);

            let name = document.createElement("td");
            name.innerText = state.user.account.allowances[i].name;
            name.classList.add("subTd");
            tr.appendChild(name);

            let amount = document.createElement("td");
            let amountValue = 0;
            if(state.user.account.allowances[i].amount === undefined){
                amountValue = (incomeTotal * (state.user.account.allowances[i].percent / 100));
            }else{
                amountValue = state.user.account.allowances[i].amount;
            }
            amount.innerText = `$${(amountValue /100).toFixed(2)}`;
            amount.classList.add("subTd");
            tr.appendChild(amount);

            let spent = document.createElement("td");
            spent.innerText = `$${allowanceSpent.toFixed(2)}`;
            spent.classList.add("subTd");
            tr.appendChild(spent);

            let remaining = document.createElement("td");
            remaining.innerText = `$${((amountValue - allowanceSpent) / 100).toFixed(2)}`;
            remaining.classList.add("subTd");
            tr.appendChild(remaining);

            let remove = document.createElement("td");
            remove.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            remove.classList.add("subTd");
            remove.classList.add("actionable");
            remove.onclick = ()=>{this.removeCategory(state.user.account.allowances[i], "allowances")};
            tr.appendChild(remove);
        }
    },

    populateCategories: function(){
        let tbody = document.getElementById("categoriesBody");

        while(tbody.children.length > 0){
            tbody.removeChild(tbody.firstChild);
        }

        for(let i = 0; i < state.user.account.categories.length; i++){
            let tr = document.createElement("tr");
            tbody.appendChild(tr);

            let name = document.createElement("td");
            name.innerText = state.user.account.categories[i];
            name.classList.add("subTd");
            tr.appendChild(name);

            let totalSpent = 0;
            for(let j = 0; j < state.user.account.transactions.length; j++){
                if(state.user.account.transactions[j].category === state.user.account.categories[i]){
                    totalSpent += state.user.account.transactions[j].amount;
                    break;
                }
            }
            let spent = document.createElement("td");
            spent.innerText = `$${totalSpent}`;
            spent.classList.add("subTd");
            tr.appendChild(spent);

            if(state.user.account.categories[i] === "Discretionary"){
                let remove = document.createElement("td");
                tr.appendChild(remove);
            }else{
                let remove = document.createElement("td");
                remove.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                `;
                remove.classList.add("subTd");
                remove.classList.add("actionable");
                remove.onclick = ()=>{this.removeCategory(state.user.account.categories[i], "categories")};
                tr.appendChild(remove);
            }
        }
    },

    removeCategory: function(thing, type){
        fetch(`/finance/category/${state.user.account.id}/${thing.name}/${type}`, {
            method: "delete"
        })
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    state.user.account.removeCategory(thing.name, type);

                    let name = (type === "categories") ? thing : thing.name;
                    controller.createBanner(`${name} REMOVED FROM ${type.toUpperCase()}`, "success");
                    controller.openPage("homePage");
                }      
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            });
    },

    deleteAccount: function(){
        fetch(`/finance/account/${state.user.account.id}`, {method: "delete"})
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error")
                }else{
                    for(let i = 0; i < state.user.accounts.length; i++){
                        if(state.user.accounts[i].id === state.user.account.id){
                            state.user.accounts.splice(i, 1);
                        }
                    }
                    state.user.account = {};
                    
                    if(state.user.accounts.length === 0){
                        controller.openPage("createAccountPage");
                    }else{
                        state.user.changeAccount(state.user.accounts[0].id);
                    }

                    controller.createBanner("ACCOUNT DELETED", "success");
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE");
            });
    }
}

module.exports = homePage;