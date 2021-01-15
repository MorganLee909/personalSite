const User = require("../models/user.js");
const Account = require("../models/account.js");
const Transaction = require("../models/transaction.js");

const bcrypt = require("bcryptjs");

module.exports = {
    enter: function(req, res){
        return res.render("finance/enter");
    },

    register: function(req, res){
        if(req.body.password !== req.body.confirmPassword){
            return res.redirect("/finance/enter");
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
                return res.redirect("/finance/enter");
            });
    },

    login: function(req, res){
        User.findOne({email: req.body.email.toLowerCase()})
            .then((user)=>{
                if(user === null){
                    return res.redirect("/finance/enter");
                }

                bcrypt.compare(req.body.password, user.password, (err, result)=>{
                    if(result === false){
                        return res.redirect("/finance/enter");
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
            return res.redirect("/finance/enter");
        }

        return res.render("finance/dashboard");
    },

    getUser: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance/enter");
        }

        let responseUser = {};
        User.findOne({_id: req.session.user}, {
            email: 0,
            password: 0
        })
            .then((user)=>{
                responseUser = user;

                if(user.accounts.length === 0){
                    throw "no account";
                }
                
                return Account.findOne({_id: user.accounts[0]}, {user: 0});
            })
            .then((account)=>{
                responseUser.account = account;

                const from = new Date(req.body.from);
                const to = new Date(req.body.to);

                return Transaction.find({
                    account: account._id,
                    date: {$gte: from, $lt: to}
                });
            })
            .then((transactions)=>{
                responseUser.account.transactions = transactions;

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
            return res.redirect("/finance/enter");
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
            return res.redirect("/finance/enter");
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
            return res.redirect("/finance/enter");
        }

        let getAccount = {};
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

                return Account.findOne({_id: req.params.id});
            })
            .then((account)=>{
                getAccount = account;

                return Transaction.find({account: account._id});
            })
            .then((transactions)=>{
                return res.json({
                    account: getAccount,
                    transactions: transactions
                });
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO GET ACCOUNT DATA");
            });
    },

    createCategory: function(req, res){
        if(req.session.user === undefined){
            return res.redirect("/finance/enter");
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
            return res.redirect("/finance/enter");
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
            return res.redirect("/finance/enter");
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
            return res.redirect("/finance/enter");
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
            return res.redirect("/finance/enter");
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
            .catch((err)=>{console.log(err)});
    }
}