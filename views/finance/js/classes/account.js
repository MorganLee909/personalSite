const Transaction = require("./transaction.js");

class Account{
    constructor(id, name, bills, income, allowances, categories, balance, transactions){
        this._id = id
        this._name = name;
        this._bills = bills;
        this._income = income;
        this._allowances = allowances;
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

    get allowances(){
        return this._allowances;
    }

    addAllowance(name, amount, percent){
        let allowance = {
            name: name
        };
        
        (amount === undefined) ? allowance.percent = percent : allowance.amount = amount;

        this._allowances.push(allowance);
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
            case "allowances":
                for(let i = 0; i < this._allowances.length; i++){
                    if(name === this._allowances[i].name){
                        this.allowances.splice(i, 1);
                    }
                }
                break;
            case "categories":
                this._categories.splice(this._categories.indexOf(name), 1);
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

        let amount = transaction.amount;
        for(let i = 0; i < state.user.account.income.length; i++){
            if(transaction.category === state.user.account.income[i].name){
                amount = -amount;
            }
        }

        this._balance += -amount;

        state.homePage.newData = true;
    }

    removeTransaction(id){
        let amount = 0;
        for(let i = 0; i < this._transactions.length; i++){
            if(this._transactions[i].id === id){
                amount = this._transactions[i]._amount;
                for(let j = 0; j < this._income.length; j++){
                    if(this._transactions[i].category === this._income[j].name){
                        amount = -amount;
                        break;
                    }
                }

                this._transactions.splice(i, 1);
                break;
            }
        }

        this._balance += amount;
        state.homePage.newData = true;
    }

    sortTransactions(property){
        this._transactions.sort((a, b) => (a[property] > b[property]) ? -1 : 1);
    }

    discretionary(){
        let bills = 0;
        let income = 0;
        let allowances = 0;

        for(let i = 0; i < this._bills.length; i++){
            bills += this._bills[i].amount;
        }

        for(let i = 0; i < this._income.length; i++){
            income += this._income[i].amount;
        }

        for(let i = 0; i < this._allowances.length; i++){
            if(this._allowances[i].amount === undefined){
                allowances += income * (this._allowances[i].percent / 100);
            }else{
                allowances += this._allowances[i].amount;
            }
        }
        
        return ((income - bills - allowances) / 100).toFixed(2);
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

    getAllowanceSpent(category){
        let total = 0;

        for(let i = 0; i < this._transactions.length; i++){
            if(this._transactions[i].category === category){
                total += this.transactions[i].amount;
            }
        }

        return total / 100;
    }
}

module.exports = Account;