let createQuestionObj = {
    display: function(){
        controller.clearScreen();
        controller.createQuestionStrand.style.display = "flex";
    },

    submit: function(){
        event.preventDefault();
        let form = document.querySelector("#createQuestionStrand form");
        let title = document.querySelector("#title");

        let category = {
            title: "",
            questions: []
        };

        if(validator.isSanitary(title.value)){
            category.title = title.value;
        }else{
            banner.createError("Illegal characters detected");
            return;
        }

        for(let i = 1; i < form.children.length - 1; i++){
            let newQuestion = {
                question: form.children[i].children[0].value,
                answer: form.children[i].children[1].value
            }

            if(validator.jeopardy.question(newQuestion.question)  && validator.jeopardy.question(newQuestion.answer)){
                category.questions.push(newQuestion);
            }else{
                return;
            }
        }

        axios.post("/jeopardy/question/create", category)
            .then((response)=>{
                if(typeof(response.data) === "string"){
                    banner.createEror(response.data);
                }else{
                    banner.createNotification("New category successfully created");
                    gameObj.display();
                }
            })
            .catch((err)=>{
                banner.createError("There was an error while creating your question");
            });
    }
}