let createCategory = {
    display: function(){
        document.getElementById("createCategoryForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        let data = {
            account: state.user.account.id,
            name: document.getElementById("createCategoryName").value
        };

        fetch("/finance/category", {
            method: "post", 
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                state.user.account.addCategory(data.name);

                controller.openPage("homePage");
            })
            .catch((err)=>{});
    }
}

module.exports = createCategory;