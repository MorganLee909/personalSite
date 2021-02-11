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
                    controller.createBanner(response, "error");
                }else{
                    controller.createBanner("TRANSACTION DELETED", "success");
                    state.user.account.removeTransaction(transaction.id);
                    controller.openPage("homePage");
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            });
    }
}

module.exports = transaction;