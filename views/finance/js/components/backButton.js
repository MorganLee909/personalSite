class BackButton extends HTMLElement{
    constructor(){
        super();
        this._shadow = this.attachShadow({mode: "open"});

        let button = document.createElement("button");
        button.onclick = ()=>{controller.openPage("homePage")};
        button.classList.add("backButton");

        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 8 8 12 12 16"></polyline>
                <line x1="16" y1="12" x2="8" y2="12"></line>
            </svg>
        `;

        this._shadow.appendChild(button);
    }
}

customElements.define("back-button", BackButton);