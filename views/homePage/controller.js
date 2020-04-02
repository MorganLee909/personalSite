let controller = {
    landingStrand: document.querySelector("#landingStrand"),
    projectsStrand: document.querySelector("#projectsStrand"),

    clearScreen: function(){
        this.landingStrand.style.display = "none";
        this.projectsStrand.style.display = "none";
    },

    onStart: function(){
        landingObj.display();
    }
}

controller.onStart();