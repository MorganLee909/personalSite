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

    get name(){
        return this._name;
    }

    get bills(){
        return this._bills;
    }

    addBill(name, amount){
        this._bills.push({
            name: name,
            amount: amount
        });

        state.homePage.newData = true;
    }

    get income(){
        return this._income;
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