let gameObj = {
    isPopulated: false,

    display: function(){
        controller.clearScreen();
        controller.gameStrand.style.display = "flex";

        if(!this.isPopulated){
            this.populateQuestions();
            this.isPopulated = true;
        }
    },

    populateQuestions: function(){
        let thead = document.querySelector("#gameStrand thead tr");
        let tbody = document.querySelector("#gameStrand tbody");

        while(thead.children.length > 0){
            thead.removeChild(thead.firstChild);
        }
        while(tbody.children.length > 0){
            tbody.removeChild(tbody.firstChild);
        }

        for(let set of sets){
            let head = document.createElement("th");
            head.innerText = set.title;
            thead.appendChild(head);
        }

        for(let i = 0; i < 5; i++){
            let row = document.createElement("tr");
            tbody.appendChild(row);

            for(let j = 0; j < 6; j++){
                let questionTd = document.createElement("td");
                questionTd.classList = "tdHover";
                questionTd.onclick = ()=>{this.chooseQuestion(questionTd, sets[j].questions[i])}
                questionTd.innerText = (i + 1) * 100;
                row.appendChild(questionTd);
            }
        }
    },

    chooseQuestion: function(questionTd, question){
        questionTd.innerText = "";
        questionTd.classList = "";
        questionTd.style.cursor = "default";

        questionObj.display(question);
    }
}