const User = require("../models/user.js");
const Account = require("../models/account.js");
const Transaction = require("../models/transaction.js");
const ObjectId = require("mongoose").Types.ObjectId;

const bcrypt = require("bcryptjs");

module.exports = {
    enter: function(req, res){
        return res.render("finance/enter");
    },

    register: function(req, res){
        if(req.body.password !== req.body.confirmPassword){
            return res.redirect("/finance");
        }

        const email = req.body.email.toLowerCase();

        User.findOne({email: email})
            .then((user)=>{
                if(user !== null){
                    return res.redirect("/finance/user");
                }

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(req.body.password, salt);

                let newUser = new User({
                    email: email,
                    password: hash,
                    accounts: []
                });

                return newUser.save();
            })
            .then((user)=>{
                req.session.user = user._id;
                return res.redirect("/finance/dashboard");
            })
            .catch((err)=>{
                return res.redirect("/finance");
            });
    },

    login: function(req, res){
        User.findOne({email: req.body.email.toLowerCase()})
            .then((user)=>{
                if(user === null){
                    return res.redirect("/finance");
                }

                bcrypt.compare(req.body.password, user.password, (err, result)=>{
                    if(result === false){
                        return res.redirect("/finance");
                    }

                    req.session.user = user._id;
                    return res.redirect("/finance/dashboard");
                });
            })
            .catch((err)=>{
                return res.redirect("finance/enter");
            });
    },

    dashboard: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        return res.render("finance/dashboard");
    },

    getUser: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        let responseUser = {};
        User.findOne({_id: req.session.user}, {
            email: 0,
            password: 0
        })
            .populate("accounts")
            .then((user)=>{
                responseUser = {
                    _id: user._id,
                    accounts: [],
                    account: {}
                }

                for(let i = 0; i < user.accounts.length; i++){
                    responseUser.accounts.push({
                        id: user.accounts[i]._id,
                        name: user.accounts[i].name
                    });
                }

                if(user.accounts.length >= 1){
                    responseUser.account = {
                        _id: user.accounts[0]._id,
                        name: user.accounts[0].name,
                        bills: user.accounts[0].bills,
                        income: user.accounts[0].income,
                        categories: user.accounts[0].categories,
                        transactions: []
                    };

                    const from = new Date(req.body.from);
                    const to = new Date(req.body.to);

                    let transactions = Transaction.find({
                        account: user.accounts[0]._id,
                        date: {$gte: from, $lt: to}
                    });

                    let balance = Transaction.aggregate([
                        {$match: {
                            account: user.accounts[0]._id
                        }},
                        {$group: {
                            _id: "$account",
                            balance: {$sum: "$amount"}
                        }}
                    ]);

                    return Promise.all([transactions, balance]);
                }

                throw "no account";
            })
            .then((response)=>{
                responseUser.account.transactions = response[0];
                if(response[1].length >= 1){
                    responseUser.account.balance = response[1][0].balance;
                }else{
                    responseUser.account.balance = 0;
                }

                return res.json(responseUser);
            })
            .catch((err)=>{
                if(err === "no account"){
                    return res.json(responseUser);
                }

                return res.json("ERROR: UNABLE TO GET USER");
            });
    },

    createAccount: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        let account = new Account({
            name: req.body.name,
            user: req.session.user,
            bills: [],
            income: [],
            categories: ["Discretionary"]
        });

        account.save()
            .then((account)=>{
                return User.findOne({_id: req.session.user});
            })
            .then((user)=>{
                user.accounts.push(account);

                return user.save();
            })
            .then((user)=>{
                return res.json(account);
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO CREATE NEW ACCOUNT");
            });
    },

    /*
    POST: create a new transaction
    req.body = {
        account: String (id of associated account),
        category: String,
        amount: Number,
        location: String,
        date: Date,
        note: String
    }
    */
    createTransaction: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        User.findOne({_id: req.session.user})
            .then((user)=>{
                let exists = false;
                for(let i = 0; i < user.accounts.length; i++){
                    if(user.accounts[i].toString() === req.body.account){
                        exists = true;
                        break;
                    }
                }
                if(exists === false){
                    throw exists;
                }

                let transaction = new Transaction({
                    account: req.body.account,
                    category: req.body.category,
                    amount: req.body.amount,
                    location: req.body.location,
                    date: new Date(req.body.date),
                    note: req.body.note
                });

                return transaction.save();
            })
            .then((transaction)=>{
                return res.json(transaction);
            })
            .catch((err)=>{});
    },

    getAccount: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        let data = {};
        User.findOne({_id: req.session.user})
            .then((user)=>{
                let exists = false;
                for(let i = 0; i < user.accounts.length; i++){
                    if(user.accounts[i].toString() === req.params.id){
                        exists = true;
                        break;
                    }
                }
                if(exists === false){
                    throw exists;
                }

                let account = Account.findOne({_id: req.params.id});

                let transactions = Transaction.find({account: req.params.id});

                let balance = Transaction.aggregate([
                    {$match: {
                        account: new ObjectId(req.params.id)
                    }},
                    {$group: {
                        _id: "$account",
                        balance: {$sum: "$amount"}
                    }}
                ]);

                return Promise.all([account, transactions, balance]);
            })
            .then((response)=>{
                data = {
                    account: {
                        _id: response[0]._id,
                        categories: response[0].categories,
                        name: response[0].name,
                        user: response[0].user,
                        bills: response[0].bills,
                        income: response[0].income
                    },
                    transactions: response[1]
                }
                
                data.account.balance = 0;
                if(response[2].length > 0){
                    data.account.balance = response[2][0].balance;
                }

                return res.json(data);
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO GET ACCOUNT DATA");
            });
    },

    deleteAccount: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        User.findOne({_id: req.session.user})
            .then((user)=>{
                let exists = false;
                for(let i = 0; i < user.accounts.length; i++){
                    if(user.accounts[i].toString() === req.params.id){
                        user.accounts.splice(i, 1);
                        exists = true;
                        break;
                    }
                }

                if(exists === false){
                    throw "YOU DO NOT HAVE PERMISSION TO DO THAT";
                }

                let userSave = user.save();
                let account = Account.deleteOne({_id: req.params.id});
                let transactions = Transaction.deleteMany({account: req.params.id});

                return Promise.all([account, transactions, userSave]);
            })
            .then((response)=>{
                return res.json({});
            })
            .catch((err)=>{});
    },

    createCategory: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        User.findOne({_id: req.session.user})
            .then((user)=>{
                let exists = false;
                for(let i = 0; i < user.accounts.length; i++){
                    if(user.accounts[i].toString() === req.body.account){
                        exists = true;
                        break;
                    }
                }
                if(exists === false){
                    throw exists;
                }


                return Account.findOne({_id: req.body.account});
            })
            .then((account)=>{
                account.categories.push(req.body.name);

                return account.save();
            })
            .then((account)=>{
                return res.json({});
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO CREATE NEW CATEGORY");
            });
    },

    createBill: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        User.findOne({_id: req.session.user})
            .then((user)=>{
                let exists = false;
                for(let i = 0; i < user.accounts.length; i++){
                    if(user.accounts[i].toString() === req.body.account){
                        exists = true;
                        break;
                    }
                }
                if(exists === false){
                    throw exists;
                }

                return Account.findOne({_id: req.body.account});
            })
            .then((account)=>{
                account.bills.push({
                    name: req.body.name,
                    amount: req.body.amount
                });

                return account.save();
            })
            .then((account)=>{
                return res.json({});
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO SAVE NEW BILL");
            });
    },

    createIncome: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        User.findOne({_id: req.session.user})
            .then((user)=>{
                let exists = false;
                for(let i = 0; i < user.accounts.length; i++){
                    if(user.accounts[i].toString() === req.body.account){
                        exists = true;
                        break;
                    }
                }
                if(exists === false){
                    throw exists;
                }

                return Account.findOne({_id: req.body.account});
            })
            .then((account)=>{
                account.income.push({
                    name: req.body.name,
                    amount: req.body.amount
                });

                return account.save();
            })
            .then((account)=>{
                return res.json({});
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO SAVE NEW INCOME");
            });
    },

    deleteTransaction: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        Transaction.findOne({_id: req.params.id})
            .populate("account")
            .then((transaction)=>{
                if(transaction.account.user.toString() !== req.session.user){
                    throw "YOU DO NOT HAVE PERMISSION TO DO THAT";
                }

                return Transaction.deleteOne({_id: req.params.id})
            })
            .then(()=>{
                return res.json({});
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO DELETE TRANSACTION");
            });
    },

    deleteCategory: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance");
        }

        Account.findOne({_id: req.params.account})
            .then((account)=>{
                if(account.user.toString() !== req.session.user){
                    throw "YOU DO NOT HAVE PERMISSION TO DO THAT";
                }

                switch(req.params.type){
                    case "category":
                        account.categories.splice(account.categories.indexOf(req.params.name));
                        break;
                    case "income":
                        for(let i = 0; i < account.income.length; i++){
                            if(account.income[i].name === req.params.name){
                                account.income.splice(i, 1);
                                break;
                            }
                        }
                        break;
                    case "bills":
                        for(let i = 0; i < account.bills.length; i++){
                            if(account.bills[i].name === req.params.name){
                                account.bills.splice(i, 1);
                                break;
                            }
                        }
                        break;
                }

                return account.save();
            })
            .then((account)=>{
                return res.json({});
            })
            .catch((err)=>{});
    }
}