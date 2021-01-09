const mongoose = require("mongoose");

let emailValid = (email)=>{
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "EMAIL IS REQUIRED"],
        validate: {
            validator: emailValid,
            message: "THAT IS NOT A VALID EMAIL ADDRESS"
        }
    },
    password: {
        type: String,
        required: [true, "PASSWORD IS REQUIRED"]
    }
});

module.exports = mongoose.model("user", userSchema);