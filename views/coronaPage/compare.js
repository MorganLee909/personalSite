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
        newState.caseFatality = (data.states[i].totalDeaths / data.states[i].totalCases) * 100;

        newState.children[0].innerText = data.states[i].name;
        newState.children[1].innerText = data.states[i].population;
        newState.children[2].innerText = data.states[i].totalCases;
        newState.children[3].innerText = data.states[i].totalDeaths;
        newState.children[4].innerText = `${newState.infectionRate.toFixed(4)}%`;
        newState.children[5].innerText = `${newState.caseFatality.toFixed(4)}%`;
        newState.children[6].innerText = `${newState.mortality.toFixed(4)}%`;

        if(governors[data.states[i].name] === "rep"){
            newState.classList = "republican";
        }else if(governors[data.states[i].name] === "dem"){
            newState.classList = "democrat";
        }

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
            newCountry.caseFatality = (data.countries[i].totalDeaths / data.countries[i].totalCases) * 100;

            newCountry.children[0].innerText = data.countries[i].name.replace(/_/g, " ");
            newCountry.children[1].innerText = data.countries[i].population;
            newCountry.children[2].innerText = data.countries[i].totalCases;
            newCountry.children[3].innerText = data.countries[i].totalDeaths;
            newCountry.children[4].innerText = `${newCountry.infectionRate.toFixed(4)}%`;
            newCountry.children[5].innerText = `${newCountry.caseFatality.toFixed(4)}%`;
            newCountry.children[6].innerText = `${newCountry.mortality.toFixed(4)}%`;

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
                return 1;
            }
            return -1;
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
                return 1;
            }
            return -1;
        });
    }

    for(let i = 0; i < states.length; i++){
        stateList.appendChild(states[i]);
    }

    stateSort = category;
}

let governors = {
    Alabama: "rep",
    Alaska: "rep",
    Arizona: "rep",
    Arkansas: "rep",
    California: "dem",
    Colorado: "dem",
    Connecticut: "dem",
    Delaware: "dem",
    Florida: "rep",
    Georgia: "rep",
    Hawaii: "dem",
    Idaho: "rep",
    Illinois: "dem",
    Indiana: "rep",
    Iowa: "rep",
    Kansas: "dem",
    Kentucky: "dem",
    Louisiana: "dem",
    Maine: "dem",
    Maryland: "rep",
    Massachusetts: "rep",
    Michigan: "dem",
    Minnesota: "dem",
    Mississippi: "rep",
    Missouri: "rep",
    Montana: "dem",
    Nebraska: "rep",
    Nevada: "dem",
    "New Hampshire": "rep",
    "New Jersey": "dem",
    "New Mexico": "dem",
    "New York": "dem",
    "North Carolina": "dem",
    "North Dakota": "rep",
    Ohio: "rep",
    Oklahoma: "rep",
    Oregon: "dem",
    Pennsylvania: "dem",
    "Rhode Island": "dem",
    "South Carolina": "rep",
    "South Dakota": "rep",
    Tennessee: "rep",
    Texas: "rep",
    Utah: "rep",
    Vermont: "rep",
    Virginia: "dem",
    Washington: "dem",
    "West Virginia": "rep",
    Wisconsin: "dem",
    Wyoming: "rep",
    "District of Columbia": "dem"
}

createStates();
populateStates("infectionRate");
createCountries();
populateCountries("infectionRate");