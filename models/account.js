const isSanitary = require("./validator.js").isSanitary;

const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    name: {
        type: "String",
        required: [true, "NAME MUST BE PROVIDED FOR ACCOUNT"],
        validate: {
            validator: isSanitary,
            message: "ACCOUNT NAME CONTAINS ILLEGAL CHARACTERS"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    balance: {
        type: Number,
        required: [true, "EVERY ACCOUNT MUST HAVE A BALANCE"],
    },
    bills: [{
        name: {
            type: String,
            required: [true, "NAME OF THE BILL IS REQUIRED"],
            validate: {
                validator: isSanitary,
                message: "BILL NAME CONTAINS ILLEGAL CHARACTERS"
            }
        },
        amount: {
            type: Number,
            required: [true, "AMOUNT OF THE BILL IS REQUIRED"],
            min: [0, "BILLS MUST CONTAIN A NON-NEGATIVE NUMBER"]
        }
    }],
    income: [{
        name: {
            type: String,
            required: [true, "NAME OF THE INCOME IS REQUIRED"],
            validate: {
                validator: isSanitary,
                message: "INCOME NAME CONTAINS ILLEGAL CHARACTERS"
            }
        },
        amount: {
            type: Number,
            required: [true, "AMOUNT OF THE INCOME IS REQUIRED"],
            min: [0, "INCOMES MUST CONTAIN A NON-NEGATIVE NUMBER"]
        }
    }],
    allowances: [{
        name: {
            type: String,
            required: [true, "NAME OF ALLOWANCE IS REQUIRED"],
            validate: {
                validator: isSanitary,
                message: "ALLOWANCE NAME CONTAINS ILLEGAL CHARACTERS"
            },
        },
        amount: {
            type: Number,
            required: false,
            min: 0
        },
        percent: {
            type: Number,
            required: false,
            min: 0
        }
    }],
    categories: [String]
});

module.exports = mongoose.model("Account", accountSchema);