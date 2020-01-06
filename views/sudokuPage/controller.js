let controller = {
    sudokuStrand: document.querySelector("#sudokuStrand"),

    clearScreen: function(){
        this.sudokuStrand.style.display = "none";
    },

    onStart: function(){
        sudokuObj.display();
    }
}

controller.onStart();