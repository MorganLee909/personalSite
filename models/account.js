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
            required: [true, "AMOUT OF THE BILL IS REQUIRED"],
            min: [0, "BILLS MUST CONTAIN A NON-NEGATIVE NUMBER"]
        }
    }],
    income: [{
        name: {
            type: String,
            required: [true, "NAME OF THE INCOME IS REQUIRED"],
            validate: {
                validator: isSanitary,
                message: "INCOME NAME CONTAINS ILLEGA CHARACTERS"
            }
        },
        amount: {
            type: Number,
            required: [true, "AMOUNT OF THE INCOME IS REQUIRED"],
            min: [0, "INCOMES MUST CONTAIN A NON-NEGATIVE NUMBER"]
        }
    }],
    categories: [String]
});

module.exports = mongoose.model("Account", accountSchema);