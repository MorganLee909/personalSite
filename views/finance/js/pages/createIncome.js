let createIncome = {
    display: function(){
        document.getElementById("createIncomeForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        let data = {
            account: state.user.account.id,
            name: document.getElementById("createIncomeName").value,
            amount: document.getElementById("createIncomeAmount").value
        }

        data.amount = parseInt(data.amount * 100);

        fetch("/finance/income", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    throw response;
                }

                state.user.account.addIncome(data.name, data.amount);

                controller.openPage("homePage");
            })
            .catch((err)=>{});
    }
}

module.exports = createIncome;