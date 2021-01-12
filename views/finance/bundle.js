(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Transaction = require("./transaction.js");

class Account{
    constructor(id, name, bills, income, categories, transactions){
        this._id = id
        this._name = name;
        this._bills = bills;
        this._income = income;
        this._categories = categories;
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

    get bills(){
        return this._bills;
    }

    get income(){
        return this._income;
    }

    get categories(){
        return this._categories;
    }

    get transactions(){
        return this._transactions;
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

        state.homePage.newDate === true;
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

    get category(){
        return this._category;
    }

    get location(){
        return this._location;
    }

    dateString(){
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric"
        }

        return this._date.toLocaleDateString("en-US", options);
    }

    amountString(){
        return `$${(this._amount / 100).toFixed(2)}`;
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
                        response.transactions
                    );

                    state.homePage.newData = true;
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
const homePage = require("./pages/home.js");
const createAccountPage = require("./pages/createAccount.js");
const createTransactionPage = require("./pages/createTransaction.js");

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
            case "createAccountPage":
                createAccountPage.display();
                break;
            case "createTransactionPage":
                createTransactionPage.display();
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
},{"./pages/createAccount.js":6,"./pages/createTransaction.js":7,"./pages/home.js":8}],6:[function(require,module,exports){
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
},{"../classes/account":1}],7:[function(require,module,exports){
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
            .catch((err)=>{
                console.log(err);
            });
    }
}

module.exports = createTransaction;
},{}],8:[function(require,module,exports){
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
        let transactions = document.getElementById("transactionsBody");
        while(transactions.children.length > 0){
            transactions.removeChild(transactions.firstChild);
        }

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
},{"../classes/user.js":4}]},{},[5]);
