let createBill = {
    display: function(){
        document.getElementById("createBillForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        let data = {
            account: state.user.account.id,
            name: document.getElementById("createBillName").value,
            amount: document.getElementById("createBillAmount").value
        }

        data.amount = parseInt(data.amount * 100);

        fetch("/finance/bill", {
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
                }else{
                    state.user.account.addBill(data.name, data.amount);

                    controller.createBanner(`${data.name} ADDED TO BILLS`);
                    controller.openPage("homePage");
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            });
    }
}

module.exports = createBill;