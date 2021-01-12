let createTransaction = {
    display: function(){
        document.getElementById("createTransactionForm").onsubmit = ()=>{this.submit()};
        document.getElementById("createTransactionAccount");

        if(state.createTransactionPage.newCategories === true){
            let selector = document.getElementById("createTransactionCategory");
            while(selector.children.length > 0){
                selector.removeChild(selector.firstChild);
            }

            for(let i = 0; i < state.user.account.bills.length; i++){
                let option = document.createElement("option");
                option.innerText = state.user.account.bills[i].name;
                option.value = state.user.account.bills[i].name;
                selector.appendChild(option);
            }

            for(let i = 0; i < state.user.account.income.length; i++){
                let option = document.createElement("option");
                option.innerText = state.user.account.income[i].name;
                option.value = state.user.account.income[i].name;
                selector.appendChild(option);
            }

            for(let i = 0; i < state.user.account.categories.length; i++){
                let option = document.createElement("option");
                option.innerText = state.user.account.categories[i];
                option.value = state.user.account.categories[i];
                selector.appendChild(option);
            }

            state.createTransactionPage.newCategories === false;
        }
    },

    submit: function(){
        event.preventDefault();

        let data = {
            account: state.user.account.id,
            category: document.getElementById("createTransactionCategory").value,
            amount: document.getElementById("createTransactionAmount").value,
            location: document.getElementById("createTransactionLocation").value,
            date: document.getElementById("createTransactionDate").valueAsDate,
            note: document.getElementById("createTransactionNote").value
        }

        data.amount *= 100;

        fetch("/finance/transaction", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                state.user.account.addTransaction(response);

                controller.openPage("homePage");
            })
            .catch((err)=>{
                console.log(err);
            });
    }
}

module.exports = createTransaction;