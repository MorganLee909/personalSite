let questionObj = {
    question: "",

    display: function(question){
        controller.clearScreen();
        controller.questionStrand.style.display = "flex";
        this.question = question;

        this.displayQuestion();
    },

    displayQuestion: function(){
        let text = document.querySelector(".questionBox h1");
        text.innerText = this.question.question;
    },

    displayAnswer: function(){
        let text = document.querySelector(".questionBox h1");
        let button = document.querySelector("#questionStrand button");

        text.innerText = this.question.answer;

        button.innerText = "Return";
        button.onclick = ()=>{this.endQuestion();};
    },

    endQuestion: function(){
        let button = document.querySelector("#questionStrand button");

        button.innerText = "Display Answer";
        button.onclick = ()=>{this.displayAnswer();};

        gameObj.display();
    }
}