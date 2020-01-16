let controller = {
    englishStrand = document.querySelector("#englishStrand"),
    russianStrand = document.querySelector("#russianStrand"),

    clearScreen = function(){
        this.englishStrand.style.display = "none";
        this.russianStrand.style.display = "none";
    },

    onStart = function(){
        englishObj.display();
    }
}

controller.onStart();