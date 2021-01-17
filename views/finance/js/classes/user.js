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