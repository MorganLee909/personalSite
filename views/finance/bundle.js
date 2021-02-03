(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Transaction = require("./transaction.js");

class Account{
    constructor(id, name, bills, income, categories, balance, transactions){
        this._id = id
        this._name = name;
        this._bills = bills;
        this._income = income;
        this._categories = categories;
        this._balance = balance;
        this._transactions = [];

        for(let i = 0; i < transactions.length; i++){
            this._transactions.push(new Transaction(
                transactions[i]._id,
                transactions[i].category,
                transactions[i].amount,
                transactions[i].location,
                transactions[i].date,
                transactions[i].note,
                transactions[i].items
            ));
        }
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get bills(){
        let data = [];

        for(let i = 0; i < this._bills.length; i++){
            data.push({
                name: this._bills[i].name,
                amount: parseFloat((this._bills[i].amount / 100).toFixed(2))
            });
        }

        return data;
    }

    addBill(name, amount){
        this._bills.push({
            name: name,
            amount: amount
        });

        state.homePage.newData = true;
    }

    get income(){
        let data = [];

        for(let i = 0; i < this._income.length; i++){
            data.push({
                name: this._income[i].name,
                amount: parseFloat((this._income[i].amount / 100).toFixed(2))
            });
        }

        return data;
    }

    addIncome(name, amount){
        this._income.push({
            name: name,
            amount: amount
        });

        state.homePage.newData = true;
    }

    get categories(){
        return this._categories;
    }

    addCategory(category){
        this._categories.push(category);

        state.homePage.newData = true;
    }

    get transactions(){
        return this._transactions;
    }

    removeCategory(name, type){
        switch(type){
            case "category":
                this._categories.splice(this._categories.indexOf(name), 1);
                break;
            case "income":
                for(let i = 0; i < this._income.length; i++){
                    if(name === this._income[i].name){
                        this._income.splice(i, 1);
                        break;
                    }
                }
                break;
            case "bills":
                for(let i = 0; i < this._bills.length; i++){
                    if(name === this._bills[i].name){
                        this._bills.splice(i, 1);
                        break;
                    }
                }
                break;
        }

        state.homePage.newData = true;
    }

    get balance(){
        return parseFloat((this._balance / 100).toFixed(2));
    }

    addTransaction(transaction){
        this._transactions.push(new Transaction(
            transaction._id,
            transaction.category,
            transaction.amount,
            transaction.location,
            new Date(transaction.date),
            transaction.note,
            transaction.items
        ));

        state.homePage.newData = true;
    }

    removeTransaction(id){
        for(let i = 0; i < this._transactions.length; i++){
            if(this._transactions[i].id === id){
                this._transactions.splice(i, 1);
                break;
            }
        }

        state.homePage.newData = true;
    }

    sortTransactions(property){
        this._transactions.sort((a, b) => (a[property] > b[property]) ? -1 : 1);
    }

    discretionary(){
        let bills = 0;
        let income = 0;

        for(let i = 0; i < this._bills.length; i++){
            bills += this._bills[i].amount;
        }

        for(let i = 0; i < this._income.length; i++){
            income += this._income[i].amount;
        }

        return parseFloat(((income - bills) / 100).toFixed(2));
    }

    remainingDiscretionary(){
        let discretionary = this.discretionary();

        for(let i = 0; i < this._transactions.length; i++){
            if(this._transactions[i].category === "Discretionary"){
                discretionary -= this._transactions[i].amount;
            }
        }

        return discretionary;
    }

    incomeTotal(){
        let income = 0;

        for(let i = 0; i < this._income.length; i++){
            income += this._income[i].amount;
        }

        return parseFloat((income / 100).toFixed(2));
    }

    billTotal(){
        let bills = 0;

        for(let i = 0; i < this._bills.length; i++){
            bills += this._bills[i].amount;
        }

        return parseFloat((bills / 100).toFixed(2));
    }
}

module.exports = Account;
},{"./transaction.js":3}],2:[function(require,module,exports){
class Item{
    constructor(name, price, amount){
        this.name = name;
        this.price = price;
        this.amount = amount;
    }
}

module.exports = Item;
},{}],3:[function(require,module,exports){
const Item = require("./item.js");

class Transaction{
    constructor(id, category, amount, location, date, note, items){
        this._id = id;
        this._category = category;
        this._amount = amount;
        this._location = location;
        this._date = new Date(date);
        this._note = note;
        this._items = [];

        for(let i = 0; i < items.length; i++){
            this._items.push(new Item(
                items[i].name,
                items[i].price,
                items[i].amount
            ));
        }
    }

    get id(){
        return this._id;
    }

    get category(){
        return this._category;
    }

    get amount(){
        return parseFloat((this._amount / 100).toFixed(2));
    }

    amountString(){
        return `$${(this._amount / 100).toFixed(2)}`;
    }

    get location(){
        return this._location;
    }

    get date(){
        return this._date;
    }

    dateString(size){
        let options = {};

        if(size === "long"){
            options = {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long"
            }
        }else if(size === "short"){
            options = {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        }
        

        return this._date.toLocaleDateString("en-US", options);
    }

    get note(){
        return this._note;
    }
}

module.exports = Transaction;
},{"./item.js":2}],4:[function(require,module,exports){
const Account = require("./account.js");

class User{
    constructor(id, accounts, account){
        this._id = id;
        this._accounts = accounts;

        if(account === undefined){
            this._account = {};
        }else{
            this._account = new Account(
                account._id,
                account.name,
                account.bills,
                account.income,
                account.categories,
                account.balance,
                account.transactions
            );
        }
    }

    get account(){
        return this._account;
    }

    /*
    Adds an account to the users list of accounts
    id: String (id of the account to add)
    */
    addAccount(id){
        this._accounts.push(id);
    }

    /*
    Changes the current account in use
    account: String OR Account
    */
    changeAccount(account){
        if(typeof(account) === "string"){
            return fetch(`/finance/account/${account}`)
                .then(response => response.json())
                .then((response)=>{
                    this._account = new Account(
                        response.account._id,
                        response.account.name,
                        response.account.bills,
                        response.account.income,
                        response.account.categories,
                        response.account.balance,
                        response.transactions
                    );

                    state.homePage.newData = true;
                    controller.openPage("homePage");
                })
                .catch((err)=>{});
        }else{
            this._account = account;
        }
    }

    get accounts(){
        return this._accounts;
    }
}

module.exports = User;
},{"./account.js":1}],5:[function(require,module,exports){
class BackButton extends HTMLElement{
    constructor(){
        super();
        this._shadow = this.attachShadow({mode: "open"});

        let button = document.createElement("button");
        button.onclick = ()=>{controller.openPage("homePage")};
        button.classList.add("backButton");

        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 8 8 12 12 16"></polyline>
                <line x1="16" y1="12" x2="8" y2="12"></line>
            </svg>
        `;

        this._shadow.appendChild(button);
    }
}

customElements.define("back-button", BackButton);
},{}],6:[function(require,module,exports){
require("./components/backButton.js");

const homePage = require("./pages/home.js");
const createAccountPage = require("./pages/createAccount.js");
const createTransactionPage = require("./pages/createTransaction.js");
const createCategoryPage = require("./pages/createCategory.js");
const createBillPage = require("./pages/createBill.js");
const createIncomePage = require("./pages/createIncome.js");
const transactionPage = require("./pages/transaction.js");
const createAllowancePage = require("./pages/createAllowance.js");

controller = {
    openPage: function(page, data){
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
            case "createTransactionPage":
                createTransactionPage.display();
                break;
            case "createCategoryPage":
                createCategoryPage.display();
                break;
            case "createBillPage":
                createBillPage.display();
                break;
            case "createIncomePage":
                createIncomePage.display();
                break;
            case "createAllowancePage":
                createAllowancePage.display();
            case "transactionPage":
                transactionPage.display(data);
                break;
        }
    }
}

state = {
    user: null,
    homePage: {
        newData: true
    },
    createTransactionPage: {
        newCategories: true
    }
}

homePage.display();
},{"./components/backButton.js":5,"./pages/createAccount.js":7,"./pages/createAllowance.js":8,"./pages/createBill.js":9,"./pages/createCategory.js":10,"./pages/createIncome.js":11,"./pages/createTransaction.js":12,"./pages/home.js":13,"./pages/transaction.js":14}],7:[function(require,module,exports){
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
                state.user.addAccount({
                    id: response._id,
                    name: response.name
                });
                
                state.user.changeAccount(new Account(
                    response._id,
                    response.name,
                    response.bills,
                    response.income,
                    response.categories,
                    0,
                    []
                ));

                state.homePage.newData = true;
                controller.openPage("homePage");
            })
            .catch((err)=>{});
    }
}

module.exports = createAccount;
},{"../classes/account":1}],8:[function(require,module,exports){
let createAllowance = {
    display: function(){
        document.getElementById("createAllowanceForm").onsubmit = ()=>{this.onsubmit()};
    },

    submit: function(){
        event.preventDefault();

        let amount = document.getElementById("createAllowanceAmount").value;
        let percent = document.getElementById("createAllowancePercent").value;

        let data = {
            name: document.getElementById("createAllowanceName").value
        }

        if(amount !== ""){
            if(percent !== ""){
                return;
            }

            data.amount = amount;
        }else{
            data.percent = percent;
        }

        fetch("/finance/allowance", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    throw response;
                }

                state.user.account.addAllowance(data.name, data.amount, data.percent);

                controller.openPage("homePage");
            })
            .catch((err)=>{
                console.log(err);
            });
    }
}

module.exports = createAllowance;
},{}],9:[function(require,module,exports){
let createBill = {
    display: function(){
        document.getElementById("createBillForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        let data = {
            account: state.user.account.id,
            name: document.getElementById("createBillName").value,
            amount: document.getElementById("createBillAmount").value
        }

        data.amount = parseInt(data.amount * 100);

        fetch("/finance/bill", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    throw response;
                }

                state.user.account.addBill(data.name, data.amount);

                controller.openPage("homePage");
            })
            .catch((err)=>{});
    }
}

module.exports = createBill;
},{}],10:[function(require,module,exports){
let createCategory = {
    display: function(){
        document.getElementById("createCategoryForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        let data = {
            account: state.user.account.id,
            name: document.getElementById("createCategoryName").value
        };

        fetch("/finance/category", {
            method: "post", 
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                state.user.account.addCategory(data.name);

                controller.openPage("homePage");
            })
            .catch((err)=>{});
    }
}

module.exports = createCategory;
},{}],11:[function(require,module,exports){
let createIncome = {
    display: function(){
        document.getElementById("createIncomeForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        let data = {
            account: state.user.account.id,
            name: document.getElementById("createIncomeName").value,
            amount: document.getElementById("createIncomeAmount").value
        }

        data.amount = parseInt(data.amount * 100);

        fetch("/finance/income", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    throw response;
                }

                state.user.account.addIncome(data.name, data.amount);

                controller.openPage("homePage");
            })
            .catch((err)=>{});
    }
}

module.exports = createIncome;
},{}],12:[function(require,module,exports){
let createTransaction = {
    display: function(){
        document.getElementById("createTransactionForm").onsubmit = ()=>{this.submit()};
        document.getElementById("createTransactionAccount");

        if(state.createTransactionPage.newCategories === true){
            let selector = document.getElementById("createTransactionCategory");
            while(selector.children.length > 0){
                selector.removeChild(selector.firstChild);
            }

            for(let i = 0; i < state.user.account.bills.length; i++){
                let option = document.createElement("option");
                option.innerText = state.user.account.bills[i].name;
                option.value = state.user.account.bills[i].name;
                selector.appendChild(option);
            }

            for(let i = 0; i < state.user.account.income.length; i++){
                let option = document.createElement("option");
                option.innerText = state.user.account.income[i].name;
                option.value = state.user.account.income[i].name;
                selector.appendChild(option);
            }

            for(let i = 0; i < state.user.account.categories.length; i++){
                let option = document.createElement("option");
                option.innerText = state.user.account.categories[i];
                option.value = state.user.account.categories[i];
                selector.appendChild(option);
            }

            state.createTransactionPage.newCategories === false;
        }
    },

    submit: function(){
        event.preventDefault();

        let data = {
            account: state.user.account.id,
            category: document.getElementById("createTransactionCategory").value,
            amount: document.getElementById("createTransactionAmount").value,
            location: document.getElementById("createTransactionLocation").value,
            date: document.getElementById("createTransactionDate").valueAsDate,
            note: document.getElementById("createTransactionNote").value
        }

        data.amount *= 100;

        fetch("/finance/transaction", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                state.user.account.addTransaction(response);

                controller.openPage("homePage");
            })
            .catch((err)=>{});
    }
}

module.exports = createTransaction;
},{}],13:[function(require,module,exports){
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
                    }
                })
                .catch((err)=>{});

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
            remove.onclick = ()=>{this.removeCategory(state.user.account.bills[i], "bills")};
            tr.appendChild(remove);
        }
    },

    removeCategory: function(thing, type){
        fetch(`/finance/category/${state.user.account.id}/${thing.name}/${type}`, {
            method: "delete"
        })
            .then(response => response.json())
            .then((response)=>{
                state.user.account.removeCategory(thing.name, type);
                controller.openPage("homePage");
            })
            .catch((err)=>{});
    },

    deleteAccount: function(){
        fetch(`/finance/account/${state.user.account.id}`, {method: "delete"})
            .then(response => response.json())
            .then((response)=>{
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
            })
            .catch((err)=>{});
    }
}

module.exports = homePage;
},{"../classes/user.js":4}],14:[function(require,module,exports){
let transaction = {
    display: function(transaction){
        document.getElementById("transactionDate").innerText = transaction.dateString("long");
        document.getElementById("transactionLocation").innerText = transaction.location;
        document.getElementById("transactionCategory").innerText = transaction.category;
        document.getElementById("transactionAmount").innerText = transaction.amountString();
        document.getElementById("transactionNote").innerText = transaction.note;

        document.getElementById("deleteTransaction").onclick = ()=>{this.delete(transaction)};
    },

    delete: function(transaction){
        fetch(`/finance/transaction/${transaction.id}`, {method: "delete"})
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    throw response;
                }

                state.user.account.removeTransaction(transaction.id);
                controller.openPage("homePage");
            })
            .catch((err)=>{});
    }
}

module.exports = transaction;
},{}]},{},[6]);
