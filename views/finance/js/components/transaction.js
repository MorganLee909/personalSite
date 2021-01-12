class Transaction extends HTMLElement{
    static get observedAttributes(){
        return ["date", "amount", "location"];
    }

    constructor(){
        super();
        this._shadow = this.attachShadow({mode: "open"});
        
        this._shadow.innerHTML = `
            <p></p>
            <p></p>
            <p></p>
        `;
    }

    attributeChangedCallback(name, oldValue, newValue){
        switch(name){
            case "date":
                this._shadow.children[0].innerText = newValue;
                break;
            case "amount": 
                this._shadow.children[1].innerText = newValue;
                break;
            case "location":
                this._shadow.children[2].innerText = newValue;
        }
    }
}

customElements.define("transaction-comp", Transaction);