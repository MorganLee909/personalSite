const isSanitary = require("./validator.js");

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "TRANSACTION MUST HAVE AN ASSOCIATED ACCOUNT"]
    },
    category: {
        type: String,
        required: [true, "TRANSACTION MUST HAVE A CATEGORY"]
    },
    amount: {
        type: Number,
        required: [true, "TRANSACTIONS MUST HAVE AN AMOUNT"],
        min: [0, "TRANSACTION AMOUNT MUST BE A NON-NEGATIVE NUMBER"]
    },
    location: {
        type: String,
        validate: {
            validator: isSanitary,
            message: "TRANSACTION LOCATION CONTAINS ILLEGAL CHARACTERS"
        }
    },
    date: {
        type: Date,
        required: [true, "TRANSACTION MUST CONTAIN A DATE"]
    },
    note: {
        type: String,
        validate: {
            validator: isSanitary,
            message: "TRANSACTION NOTE CONTAINS ILLEGAL CHARACTERS"
        }
    },
    items: [{
        name: {
            type: String,
            required: [true, "ITEM NAME IS REQUIRED"],
            validate: {
                validator: isSanitary,
                message: "ITEM NAME CONTAINS ILLEGAL CHARACTERS"
            }
        },
        price: {
            type: Number,
            required: [true, "ITEM MUST CONTAIN A PRICE"]
        },
        amount: {
            type: Number,
            required: [true, "ITEM MUST CONTAIN AN AMOUNT"]
        }
    }]
});

module.exports = mongoose.model("Transaction", transactionSchema);