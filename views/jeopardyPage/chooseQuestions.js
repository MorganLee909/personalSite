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
                        card.onclick = ()=>{this.addSet(card);};
                        container.appendChild(card);

                        let title = document.createElement("h3");
                        title.innerText = set.title;
                        card.appendChild(title);

                        for(let question of set.questions){
                            let questionPar = document.createElement("p");
                            questionPar.innerText = `${question.question} - ${question.answer}`;
                            card.appendChild(questionPar);
                        }
                    }
                }
            })
            .catch((err)=>{
                banner.createError("There has been an oopsie");
            });
    },

    newSets: function(){
        event.preventDefault();

        this.populateSets(document.querySelector("#catSearch").value);
    },

    addSet: function(card){
        if(this.sets.length < 6){
            this.sets.push(card.set);
            card.classList = "chosenCard";
            card.onclick = ()=>{this.removeSet(card);};
        }else{
            banner.createError("You can only choose 6 sets of questions");
        }
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
        if(this.sets.length === 6){
            sets = this.sets;
            this.sets = [];
            gameObj.isPopulated = false;
            gameObj.display();
        }else{
            banner.createError("You must choose exactly 6 sets of questions");
        }
    }
}