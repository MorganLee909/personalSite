let controller = {
    gameStrand: document.querySelector("#gameStrand"),
    createQuestionStrand: document.querySelector("#createQuestionStrand"),
    questionStrand: document.querySelector("#questionStrand"),
    chooseQuestionsStrand: document.querySelector("#chooseQuestionsStrand"),

    clearScreen: function(){
        this.gameStrand.style.display = "none";
        this.createQuestionStrand.style.display = "none";
        this.questionStrand.style.display = "none";
        this.chooseQuestionsStrand.style.display = "none";
    },

    onStart: function(){
        gameObj.display();
    }
}

controller.onStart();