let states = [];
let countries = [];
let stateSort = "";
let countrySort = "";

let createStates = ()=>{
    let template = document.querySelector("#state").content.children[0];
    
    for(let i = 0; i < data.states.length; i++){
        let newState = template.cloneNode(true);

        newState.infectionRate = (data.states[i].totalCases / data.states[i].population) * 100;
        newState.mortality = (data.states[i].totalDeaths / data.states[i].population) * 100;
        newState.name = data.states[i].name;
        newState.population = data.states[i].population;
        newState.totalCases = data.states[i].totalCases;
        newState.totalDeaths = data.states[i].totalDeaths;

        newState.children[0].innerText = data.states[i].name;
        newState.children[1].innerText = data.states[i].population;
        newState.children[2].innerText = data.states[i].totalCases;
        newState.children[3].innerText = data.states[i].totalDeaths;
        newState.children[4].innerText = `${newState.infectionRate.toFixed(4)}%`;
        newState.children[5].innerText = `${newState.mortality.toFixed(4)}%`;

        states.push(newState);
    }
}

let createCountries = ()=>{
    let template = document.querySelector("#state").content.children[0];
    
    for(let i = 0; i < data.countries.length; i++){
        if(data.countries[i].population){
            let newCountry = template.cloneNode(true);

            newCountry.infectionRate = (data.countries[i].totalCases / data.countries[i].population) * 100;
            newCountry.mortality = (data.countries[i].totalDeaths / data.countries[i].population) * 100;
            newCountry.name = data.countries[i].name;
            newCountry.population = data.countries[i].population;
            newCountry.totalCases = data.countries[i].totalCases;
            newCountry.totalDeaths = data.countries[i].totalDeaths;

            newCountry.children[0].innerText = data.countries[i].name.replace(/_/g, " ");
            newCountry.children[1].innerText = data.countries[i].population;
            newCountry.children[2].innerText = data.countries[i].totalCases;
            newCountry.children[3].innerText = data.countries[i].totalDeaths;
            newCountry.children[4].innerText = `${newCountry.infectionRate.toFixed(4)}%`;
            newCountry.children[5].innerText = `${newCountry.mortality.toFixed(4)}%`;

            countries.push(newCountry);
        }
    }
}

let populateCountries = (category)=>{
    let countryList = document.querySelector("#countryList tbody");

    while(countryList.children.length > 0){
        countryList.removeChild(countryList.firstChild);
    }

    if(countrySort === category){
        countries.reverse();
    }else{
        countries.sort((a, b)=>{
            if(b[category] > a[category]){
                return -1;
            }
            return 1;
        });
    }

    for(let i = 0; i < countries.length; i++){
        countryList.appendChild(countries[i]);
    }

    countrySort = category;
}

let populateStates = (category)=>{
    let stateList = document.querySelector("#stateList tbody");

    while(stateList.children.length > 0){
        stateList.removeChild(stateList.firstChild);
    }

    if(category === stateSort){
        states.reverse();
    }else{
        states.sort((a, b)=>{
            if(b[category] > a[category]){
                return -1;
            }
            return 1;
        });
    }

    for(let i = 0; i < states.length; i++){
        stateList.appendChild(states[i]);
    }

    stateSort = category;
}

createStates();
populateStates("infectionRate");
createCountries();
populateCountries("infectionRate");