controller = {};

class StrandSelector extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        setTimeout(()=>{
            this.setAttribute("strand", "english");

            let strands = document.querySelectorAll(".strand");
            for(let strand of strands){
                controller[strand.id] = strand;

                strand.style.display = "none";

                let selector = document.createElement("button");
                selector.strandName = strand.id;
                selector.innerText = strand.id.slice(0, strand.id.indexOf("Strand")).toUpperCase();
                this.appendChild(selector);
            }

            strands[0].style.display = "flex";
        })
    }

    static get observedAttributes(){
        return ["strand"];
    }

    attributeChangedCallback(){
        setTimeout(()=>{
            let buttons = this.querySelectorAll("button");

            for(let button of buttons){
                if(button.innerText.toLowerCase() === this.getAttribute("strand").toLowerCase()){
                    button.style.borderBottom = "3px solid black";
                    button.style.cursor = "default";
                }else{
                    button.style.borderBottom = "none";
                    button.style.cursor = "pointer";
                    button.onclick = ()=>{
                        this.setAttribute("strand", button.strandName.slice(0, button.strandName.indexOf("Strand")));

                        let strands = document.querySelectorAll(".strand");
                        for(let strand of strands){
                            strand.style.display = "none";
                        }

                        controller[button.strandName].style.display = "flex";
                    }
                }
            }
        })
    }
}

customElements.define("strand-selector", StrandSelector);