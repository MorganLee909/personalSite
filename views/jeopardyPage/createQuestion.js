let createQuestionObj = {
    display: function(){
        controller.clearScreen();
        controller.createQuestionStrand.style.display = "flex";
    },

    cancel: function(){
        event.preventDefault();

        gameObj.display();
    },

    submit: function(){
        event.preventDefault();

        let form = document.querySelector("#createQuestionStrand form");
        let title = document.querySelector("#title").value;
        let category = document.querySelector("#category").value;

        let set = {
            title: "",
            category: "",
            questions: []
        };

        if(validator.isSanitary(title)  && validator.isSanitary(category)){
            set.title = title;
            set.category = category;
        }else{
            banner.createError("Illegal characters detected");
            return;
        }

        for(let i = 2; i < form.children.length - 1; i++){
            let newQuestion = {
                question: form.children[i].children[0].value,
                answer: form.children[i].children[1].value
            }

            if(validator.jeopardy.question(newQuestion.question)  && validator.jeopardy.question(newQuestion.answer)){
                set.questions.push(newQuestion);
            }else{
                return;
            }
        }

        gameObj.display();

        axios.post("/jeopardy/question/create", set)
            .then((response)=>{
                if(typeof(response.data) === "string"){
                    banner.createEror(response.data);
                }else{
                    banner.createNotification("New category successfully created");
                }
            })
            .catch((err)=>{
                banner.createError("There was an error while creating your question");
            });
    }
}