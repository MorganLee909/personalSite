class Transaction extends HTMLElement{
    static get observedAttributes(){
        return ["date", "amount", "location"];
    }

    constructor(){
        super();
        this._shadow = this.attachShadow({mode: "open"});
        
        let tr = document.createElement("tr");
        tr.classList.add("transaction");
        tr.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `
        this._shadow.appendChild(tr);
    }

    attributeChangedCallback(name, oldValue, newValue){
        switch(name){
            case "date":
                this._shadow.children[0].children[0].innerText = newValue;
                break;
            case "category":
                this._shadow.children[0].children[1].innerText = newValue;
                break;
            case "location":
                this._shadow.children[0].children[2].innerText = newValue;
                break;
            case "amount": 
                this._shadow.children[0].children[3].innerText = newValue;
                break;
        }
    }
}

customElements.define("transaction-comp", Transaction);