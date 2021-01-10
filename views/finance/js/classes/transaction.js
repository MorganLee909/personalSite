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
}

module.exports = Transaction;