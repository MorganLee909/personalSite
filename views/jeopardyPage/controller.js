let controller = {
    gameStrand: document.querySelector("#gameStrand"),
    createQuestionStrand: document.querySelector("#createQuestionStrand"),

    clearScreen: function(){
        this.gameStrand.style.display = "none";
        this.createQuestionStrand.style.display = "none";
    },

    onStart: function(){
        gameObj.display();
    }
}

controller.onStart();