let chooseQuestionsObj = {
    sets: [],

    display: function(){
        controller.clearScreen();
        controller.chooseQuestionsStrand.style.display = "flex";

        this.populateSets();
    },

    populateSets: function(category = ""){
        axios.post("/jeopardy/questions", {category: category})
            .then((response)=>{
                if(typeof(response.data) === "string"){
                    banner.createError(response.data);
                }else{
                    let container = document.querySelector("#sets");

                    while(container.children.length > 0){
                        container.removeChild(container.firstChild);
                    }

                    for(let set of response.data){
                        let card = document.createElement("div");
                        card.set = set;
                        card.classList = "setCard";
                        card.innerText = set.title;
                        card.onclick = ()=>{this.addSet(card);};
                        container.appendChild(card);
                    }
                }
            })
            .catch((err)=>{
                banner.createError("There has been an oopsie");
            });
    },

    addSet: function(card){
        this.sets.push(card.set);
        card.classList = "chosenCard";
        card.onclick = ()=>{this.removeSet(card);};
    },

    removeSet: function(card){
        for(let i = 0; i < this.sets.length; i++){
            if(this.sets[i]._id === card.set._id){
                this.sets.splice(i, 1);
                break;
            }
        }

        card.classList = "setCard";
        card.onclick = ()=>{this.addSet(card);};
    },

    submit: function(){
        gameObj.display();
        gameObj.populateQuestions(sets);
        this.sets = [];
    }
}