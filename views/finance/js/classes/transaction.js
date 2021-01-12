const Item = require("./item.js");

class Transaction{
    constructor(id, category, amount, location, date, note, items){
        this._id = id;
        this._category = category;
        this._amount = amount;
        this._location = location;
        this._date = new Date(date);
        this._note = note;
        this._items = [];

        for(let i = 0; i < items.length; i++){
            this._items.push(new Item(
                items[i].name,
                items[i].price,
                items[i].amount
            ));
        }
    }

    get category(){
        return this._category;
    }

    get amount(){
        return parseFloat((this._amount / 100).toFixed(2));
    }

    get location(){
        return this._location;
    }

    get date(){
        return this._date;
    }

    dateString(){
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric"
        }

        return this._date.toLocaleDateString("en-US", options);
    }

    amountString(){
        return `$${(this._amount / 100).toFixed(2)}`;
    }
}

module.exports = Transaction;