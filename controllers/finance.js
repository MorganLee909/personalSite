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
            categories: ["discretionary"]
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
    }
}