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