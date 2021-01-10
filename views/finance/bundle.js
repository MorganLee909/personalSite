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
}

module.exports = Transaction;
},{"./item.js":2}],4:[function(require,module,exports){
const Account = require("./account.js");

class User{
    constructor(id, accounts, account){
        this._id = id;
        this._accounts = accounts;
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

module.exports = User;
},{"./account.js":1}],5:[function(require,module,exports){
const homePage = require("./pages/home.js");

controller = {
    openPage: function(page){
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
    user: undefined,
    homePage: {
        newData: true
    }
}

homePage.display();
},{"./pages/home.js":6}],6:[function(require,module,exports){
const User = require("../classes/user.js");

const homePage = {
    display: function(){
        console.log(state.user === undefined);
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
                    console.log(response);
                    if(response.accounts.length === 0){
                        controller.openPage("createAccountPage")
                    }else{
                        state.user = new User(
                            response._id,
                            response.accounts,
                            response.account
                        );

                        state.homePage.newData = true;
                    };
                })
                .catch((err)=>{
                    console.log(err);
                });
        }

        if(state.homePage.newData === true){
            console.log("populating");
        }
    }
}

module.exports = homePage;
},{"../classes/user.js":4}]},{},[5]);
