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
                    controller.createBanner(response, "error");
                }

                state.user.account.addIncome(data.name, data.amount);

                controller.createBanner(`${data.name} ADDED TO INCOME`, "success");
                controller.openPage("homePage");
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH PAGE", "error");
            });
    }
}

module.exports = createIncome;