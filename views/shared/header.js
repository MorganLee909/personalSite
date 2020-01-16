class Header extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.id = "header";
        this.innerHTML = `
            <a href="/">Lee Morgan</a>
        `;
    }
}

customElements.define("header-tag", Header);