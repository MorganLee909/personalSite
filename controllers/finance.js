const User = require("../models/user.js");

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
                    password: hash
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
        console.log("this is the dashboard");
    }
}