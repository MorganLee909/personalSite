let transaction = {
    display: function(transaction){
        document.getElementById("transactionDate").innerText = transaction.dateString("long");
        document.getElementById("transactionLocation").innerText = transaction.location;
        document.getElementById("transactionCategory").innerText = transaction.category;
        document.getElementById("transactionAmount").innerText = transaction.amountString();
        document.getElementById("transactionNote").innerText = transaction.note;
    }
}

module.exports = transaction;