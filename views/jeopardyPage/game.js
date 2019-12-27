let gameObj = {
    isPopulated: false,

    display: function(){
        controller.clearScreen();
        controller.gameStrand.style.display = "flex";
        if(!this.isPopulated){
            this.populateQuestions();
        }
    },

    populateQuestions: function(){
        let thead = document.querySelector("#gameStrand thead tr");
        let tbody = document.querySelector("#gameStrand tbody");

        for(let set of sets){
            let head = document.createElement("th");
            head.innerText = set.title;
            thead.appendChild(head);
        }

        for(let i = 0; i < 5; i++){
            let row = document.createElement("tr");
            tbody.appendChild(row);

            for(let j = 0; j < 6; j++){
                let question = document.createElement("td");
                question.innerText = sets[j].questions[i].question;
                row.appendChild(question);
            }
        }
    }
}