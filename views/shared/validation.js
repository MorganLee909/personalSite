let validator = {
    jeopardy: {
        question: function(question, createBanner = true){
            if(!validator.isSanitary(question)){
                if(createBanner){
                    banner.createError("Illegal characters detected");
                }
                return false;
            }
            return true;
        },

        answer: function(answer, createBanner = true){
            if(!validator.isSanitary(answer)){
                if(createBanner){
                    banner.createError("Illegal characters detected");
                }
                return false;
            }
            return true;
        }
    },

    isSanitary: function(str){
        let disallowed = ["\\", "<", ">", "$"];

        for(let char of disallowed){
            if(str.includes(char)){
                return false;
            }
        }

        return true;
    }
}