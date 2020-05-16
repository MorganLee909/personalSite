let totalDeaths, totalCases, sevenDayAvg, thirtyDayAvg;

for(let i = 0; i < data.length; i++){
    data[i].date = new Date(data[i].date);

    if(!window.location.href.includes("us/")){
        data[i].date.setDate(data[i].date.getDate() - 1);
    }
}

//Populate page
let createHeader = ()=>{
    let displayLocation = window.location.href.slice(window.location.href.indexOf("corona") + 7).replace("?", "");
    let latestDate = data[data.length-1].date;

    if(displayLocation.includes("us/")){
        let placeArray = displayLocation.split("/");
        let secondArray = placeArray[placeArray.length-1].split("-");
        displayLocation = "";
        for(let str of secondArray){
            displayLocation += str[0].toUpperCase() + str.slice(1);
            displayLocation += " ";
        }
        if(placeArray.length === 3){
            displayLocation += "County";
        }

        document.querySelector("#usSearch").style.display = "flex";
        document.querySelector("#note").style.display = "flex";
    }else{
        switch(displayLocation){
            case "us": displayLocation = "the US"; break;
            case "china": displayLocation = "China"; break;
            case "taiwan": displayLocation = "Taiwan"; break;
            case "canada": displayLocation = "Canada"; break;
            case "russia": displayLocation = "Russia"; break;
            case "ukraine": displayLocation = "Ukraine"; break;
            case "kazakhstan": displayLocation = "Kazakhstan"; break;
            case "sweden": displayLocation= "Sweden"; break;
            default: displayLocation = "the world";
        }

        if(displayLocation === "the US"){
            document.querySelector("#usSearch").style.display = "flex";
            document.querySelector("#note").style.display = "flex";
        }else{
            document.querySelector("#usSearch").style.display = "none";
            document.querySelector("#note").style.display = "none";
        }
    }

    document.querySelector("#locationHeader").innerText = `CCP Corona Virus Data for ${displayLocation}`;
    document.querySelector("#dateHeader").innerText = latestDate.toDateString();
}

let newCasesData = ()=>{
    document.querySelector("#newCases").innerText = data[data.length-1].newCases;
}

let totalCasesData = ()=>{
    let total = 0;
    for(let i = 0; i < data.length; i++){
        total += data[i].newCases;
    }
    document.querySelector("#totalCases").innerText = total;
    totalCases = total;
}

let average7DayData = ()=>{
    let element = document.querySelector("#newCaseAverage7");
    let day = new Date(data[data.length-1].date);
    let sum = 0;

    for(let i = 1; i <= 7; i++){
        if(data[data.length-i].date.getDate() !== day.getDate()){
            element.innerText = "INCOMPLETE DATA";
            element.style.color = "red";
            return;
        }

        sum += data[data.length-i].newCases;

        day.setDate(day.getDate()-1);
    }

    sevenDayAvg = sum / 7
    element.innerText = Math.round(sevenDayAvg);
}

let average30DayData = ()=>{
    let element = document.querySelector("#newCaseAverage30");
    let day = new Date(data[data.length-1].date);
    let sum = 0;

    for(let i = 1; i <= 30; i++){
        if(data[data.length-i].date.getDate() !== day.getDate()){
            element.innerText = "INCOMPLETE DATA";
            element.style.color = "red";
            return;
        }

        sum += data[data.length-i].newCases;

        day.setDate(day.getDate()-1);
    }

    thirtyDayAvg = sum / 30;
    element.innerText = Math.round(thirtyDayAvg);
}

let totalDeathsData = ()=>{
    let total = 0;

    for(let i = 0; i < data.length; i++){
        total += data[i].newDeaths
    }

    document.querySelector("#totalDeaths").innerText = total;
    totalDeaths = total;
}

let newDeathsData = ()=>{
    document.querySelector("#newDeaths").innerText = data[data.length-1].newDeaths;
}

let caseFatalityData = ()=>{
    document.querySelector("#caseFatality").innerText = `${((totalDeaths / totalCases) * 100).toFixed(4)}%`;
}

let mortalityData = ()=>{
    if(window.location.href.includes("us/")){
        return;
    }

    document.querySelector("#mortality").innerText = `${((totalDeaths / data[0].population) * 100).toFixed(4)}%`;
}

let previousDayAnal = ()=>{
    let percent = ((data[data.length-1].newCases - data[data.length-2].newCases) / data[data.length-2].newCases) * 100;
    let element = document.querySelector("#percentYesterday");

    if(percent > 0){
        element.innerText = `${percent.toFixed(2)}% more new cases than yesterday`;
        element.style.color = "red";
    }else if(percent < 0){
        element.innerText = `${Math.abs(percent).toFixed(2)}% fewer new cases than yesterday`;
        element.style.color = "green";
    }else{
        element.innerText = "Same number of new cases as yesterday";
    }
}

let sevenDayAnal = ()=>{
    let percent = ((data[data.length-1].newCases - sevenDayAvg) / sevenDayAvg) * 100;
    let element = document.querySelector("#percent7Day");

    if(percent > 0){
        element.innerText = `${percent.toFixed(2)}% more new cases than the 7-day average`;
        element.style.color = "red";
    }else if(percent < 0){
        element.innerText = `${Math.abs(percent).toFixed(2)}% fewer new cases than the 7-day average`;
        element.style.color = "green";
    }else{
        element.innerText = "Same number of new cases as the 7-day average";
    }
}

let thirtyDayAnal = ()=>{
    let percent = ((data[data.length-1].newCases - thirtyDayAvg) / thirtyDayAvg) * 100;
    let element = document.querySelector("#percent30Day");

    if(percent > 0){
        element.innerText = `${percent.toFixed(2)}% more new cases than the 30-day average`;
        element.style.color = "red";
    }else if(percent < 0){
        element.innerText = `${Math.abs(percent).toFixed(2)}% fewer new cases than the 30-day average`;
        element.style.color = "green";
    }else{
        element.innerText = "Same number of new cases as the 30-day average";
    }
}

let sevenThirtyAnal = ()=>{
    let percent = ((sevenDayAvg - thirtyDayAvg) / thirtyDayAvg) * 100;
    let element = document.querySelector("#percentAverages");

    if(percent > 0){
        element.innerText = `7-day average is ${percent.toFixed(2)}% higher than 30-day average`;
        element.style.color = "red";
    }else if(percent < 0){
        element.innerText = `7-day average is ${Math.abs(percent).toFixed(2)}% lower than 30-day average`;
        element.style.color = "green";
    }else{
        element.innerText = "7-day and 30-day averages are the same";
    }
}

//Graph stuff
let getDates = ()=>{
    let arr = [];
    let checkDate = new Date(data[0].date.getFullYear(), data[0].date.getMonth(), data[0].date.getDate());

    for(let i = 0; i < data.length; i++){
        let newDate = new Date(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate());
        
        arr.push(new Date(checkDate));

        if(checkDate.getTime() !== newDate.getTime()){
            i--;
        }

        checkDate.setDate(checkDate.getDate() + 1);
    }

    return arr;
}

let getNewCases = ()=>{
    let arr = []
    let checkDate = new Date(data[0].date.getFullYear(), data[0].date.getMonth(), data[0].date.getDate());

    for(let i = 0; i < data.length; i++){
        let newDate = new Date(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate());
        
        if(checkDate.getTime() !== newDate.getTime()){
            arr.push(undefined);
            i--;
        }else{
            arr.push(data[i].newCases);
        }

        checkDate.setDate(checkDate.getDate() + 1);
    }

    return arr;
}

let getNewDeaths = ()=>{
    let arr = []
    let checkDate = new Date(data[0].date.getFullYear(), data[0].date.getMonth(), data[0].date.getDate());

    for(let i = 0; i < data.length; i++){
        let newDate = new Date(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate());
        
        if(checkDate.getTime() !== newDate.getTime()){
            arr.push(undefined);
            i--;
        }else{
            arr.push(data[i].newDeaths);
        }

        checkDate.setDate(checkDate.getDate() + 1);
    }

    return arr;
}

let graph = ()=>{
    let dates = getDates();

    let newDeaths = {
        x: dates,
        y: getNewDeaths(),
        mode: "lines+markers",
        name: "New Deaths"
    }

    let newCases = {
        x: dates,
        y: getNewCases(),
        mode: "lines+markers",
        name: "New Cases"
    }

    let graphData = [newDeaths, newCases];

    Plotly.newPlot("graph", graphData);
}

createHeader();
newCasesData();
totalCasesData();
average7DayData();
average30DayData();
totalDeathsData();
newDeathsData();
caseFatalityData();
mortalityData();
previousDayAnal();
sevenDayAnal();
thirtyDayAnal();
sevenThirtyAnal();
graph();

//US data form submission
let getUSData = function(){
    event.preventDefault();

    let state = document.querySelector("#state").value;
    let county = document.querySelector("#county").value;

    state = state.replace(/ /g, "-").toLowerCase();

    if(county !== ""){
        county = `/${county.replace(/ /g, "-").toLowerCase()}`;
    }

    let form = document.querySelector("#usSearch");
    form.action = `/corona/us/${state}${county}`;
    console.log(form.action);
    form.submit();
}