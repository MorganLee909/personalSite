let createAllowance = {
    display: function(){
        document.getElementById("createAllowanceForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        let amount = document.getElementById("createAllowanceAmount").value;
        let percent = document.getElementById("createAllowancePercent").value;

        let data = {
            name: document.getElementById("createAllowanceName").value,
            account: state.user.account.id
        }

        if(amount !== ""){
            if(percent !== ""){
                return;
            }

            data.amount = amount;
        }else{
            data.percent = percent;
        }

        fetch("/finance/allowance", {
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

                state.user.account.addAllowance(data.name, data.amount, data.percent);

                controller.openPage("homePage");
            })
            .catch((err)=>{
                console.log(err);
            });
    }
}

module.exports = createAllowance;