let transaction = {
    display: function(transaction){
        document.getElementById("transactionDate").innerText = transaction.dateString("long");
        document.getElementById("transactionLocation").innerText = transaction.location;
        document.getElementById("transactionCategory").innerText = transaction.category;
        document.getElementById("transactionAmount").innerText = transaction.amountString();
        document.getElementById("transactionNote").innerText = transaction.note;

        document.getElementById("deleteTransaction").onclick = ()=>{this.delete(transaction)};
    },

    delete: function(transaction){
        fetch(`/finance/transaction/${transaction.id}`, {method: "delete"})
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    throw response;
                }

                state.user.account.removeTransaction(transaction.id);
                controller.openPage("homePage");
            })
            .catch((err)=>{});
    }
}

module.exports = transaction;