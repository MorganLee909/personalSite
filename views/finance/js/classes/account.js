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