let url = window.location.href;
let displayLocation = url.slice(url.indexOf("corona") + 7);

for(let point of data){
    point.date = new Date(point.date);
    if(!displayLocation.includes("us/")){
        point.date.setDate(point.date.getDate() - 1);
    }
}

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
document.querySelector("#date").valueAsDate = latestDate;

//Left-hand data
let calculateTotalCases = function(endDate){
    let total = 0;
    for(let point of data){
        if(point.date > endDate){
            break;
        }

        total += point.newCases;
    }

    return total;
}

let calculateTotalDeaths = function(endDate){
    let total = 0;
    for(let point of data){
        if(point.date > endDate){
            break;
        }
        total += point.newDeaths;
    }

    return total;
}

let calculateNewCaseAverage = function(numDays, endDate){
    let total = 0;
    for(let i = 0; i < data.length; i++){
        let forDate = data[i].date;
        if(
            forDate.getDate() === endDate.getDate() &&
            forDate.getMonth() === endDate.getMonth()
        ){
            for(let j = 0; j < numDays; j++){
                
                total += data[i-j].newCases;
            }
        }
    }

    return Math.round(total / numDays);
}

let calculateGrowth = function(currentCases, compareCases){
    let num = ((currentCases - compareCases) / compareCases) * 100;

    return num;
}

//Graphing
let dataValid = function(startIndex, endIndex){
    let isValid = true;
    try{
        for(let i = startIndex; i < endIndex; i++){
            let nextDay = new Date(data[i].date.getTime());
            nextDay = new Date(nextDay.setDate(nextDay.getDate() + 1));
            if(nextDay.getTime() !== data[i+1].date.getTime()){
                isValid = false;
                break;
            }
        }
    }catch{
        isValid = false;
    }finally{
        return isValid;
    }
}

let graphTotalCases = function(numDays, endDateIndex = data.length - 1){
    let arr = [];
    let total = 0;
    for(let i = 0; i < data.length; i++){
        total += data[i].newCases;
        if(i >= endDateIndex - numDays){
            arr.push(total);
        }
        if(i >= endDateIndex){
            break;
        }
    }

    return arr;
}

let graphNewCases = function(numDays, endDateIndex = data.length - 1){
    let arr = [];
    for(let i = endDateIndex - numDays; i <= endDateIndex; i++){
        
        arr.push(data[i].newCases);
    }

    return arr;
}

let graphTotalDeaths = function(numDays, endDateIndex = data.length - 1){
    let arr = [];
    let total = 0;
    for(let i = 0; i < data.length; i++){
        total += data[i].newDeaths;
        if(i >= endDateIndex - numDays){
            arr.push(total);
        }
        if(i >= endDateIndex){
            break;
        }
    }

    return arr;
}

let graphNewDeaths = function(numDays, endDateIndex = data.length - 1){
    let arr = [];
    for(let i = endDateIndex - numDays; i <= endDateIndex; i++){
        arr.push(data[i].newDeaths);
    }

    return arr;
}

let canvas = document.querySelector("#myCanvas");

let graph = new LineGraph(
    canvas,
    "",
    "Date"
)

//Data change
let dataChange = function(){
    let date = document.querySelector("#date").valueAsDate;
    let header = document.querySelector("#dateHeader");
    let latestDate = data[data.length-1].date;

    if(date > latestDate){
        header.innerText = "Data not available";
        header.style.color = "red";
        return;
    }

    let badData = document.querySelector("#status");
    let main = document.querySelector(".horizontal");
    let newDateIndex = 0;
    header.innerText = date.toDateString();
    header.style.color = "black";

    for(let i = 0; i < data.length; i++){
        let forDate = new Date(data[i].date);
        if(
            forDate.getDate() === date.getDate() &&
            forDate.getMonth() === date.getMonth()
        ){
            newDateIndex = i;
            break;
        }
    }

    let newCaseAverage7 = document.querySelector("#newCaseAverage7");
    let newCaseAverage30 = document.querySelector("#newCaseAverage30");
    if(dataValid(newDateIndex - 7, newDateIndex)){
        newCaseAverage7.innerText = calculateNewCaseAverage(7, date);
        newCaseAverage7.style.color = "black";

        let percent7Day = document.querySelector("#percent7Day");
        let percent = calculateGrowth(data[newDateIndex].newCases, calculateNewCaseAverage(7, date));
        if(percent > 0){
            percent7Day.innerText = `${percent.toFixed(2)}% more cases than 7-day average`;
            percent7Day.style.color = "red";
        }else{
            percent7Day.innerText = `${Math.abs(percent).toFixed(2)}% fewer cases than 7-day average`;
            percent7Day.style.color = "green";
        }

        if(dataValid(newDateIndex - 30, newDateIndex)){
            newCaseAverage30.innerText = calculateNewCaseAverage(30, date);
            newCaseAverage30.style.color = "black";

            let percent30Day = document.querySelector("#percent30Day");
            percent = calculateGrowth(data[newDateIndex].newCases, calculateNewCaseAverage(30, date));
            if(percent > 0){
                percent30Day.innerText = `${percent.toFixed(2)}% more cases than 30-day average`;
                percent30Day.style.color = "red";
            }else{
                percent30Day.innerText = `${Math.abs(percent).toFixed(2)}% fewer cases than 30-day average`;
                percent30Day.style.color = "green";
            }

            let percentAverages = document.querySelector("#percentAverages");
            percent = calculateGrowth(calculateNewCaseAverage(7, date), calculateNewCaseAverage(30, date));
            if(percent > 0){
                percentAverages.innerText = `7-day average is ${percent.toFixed(2)}% higher than the 30-day average`;
                percentAverages.style.color = "red";
            }else{
                percentAverages.innerText = `7-day average is ${Math.abs(percent).toFixed(2)}% lower than the 30-day average`;
                percentAverages.style.color = "green";
            }
        }else{
            newCaseAverage30.innerText = "INSUFFICIENT DATA";
            newCaseAverage30.style.color = "red";
        }
    }else{
        newCaseAverage7.innerText = "INSUFFICIENT DATA";
        newCaseAverage7.style.color = "red";
    }
    
    document.querySelector("#totalCases").innerText = calculateTotalCases(date);
    document.querySelector("#totalDeaths").innerText = calculateTotalDeaths(date);
    document.querySelector("#newCases").innerText = data[newDateIndex].newCases;
    document.querySelector("#newDeaths").innerText = data[newDateIndex].newDeaths;
    
    document.querySelector("#caseFatality").innerText = `${((calculateTotalDeaths(date) / calculateTotalCases(date)) * 100).toFixed(2)}%`;
    document.querySelector("#mortality").innerText = `${((calculateTotalDeaths(date) / data[0].population) * 100).toFixed(4)}%`;

    let percentYesterday = document.querySelector("#percentYesterday");
    percent = calculateGrowth(data[newDateIndex].newCases, data[newDateIndex-1].newCases);
    if(percent > 0){
        percentYesterday.innerText = `${percent.toFixed(2)}% more cases than previous day`;
        percentYesterday.style.color = "red";
    }else{
        percentYesterday.innerText = `${Math.abs(percent).toFixed(2)}% fewer cases than previous day`;
        percentYesterday.style.color = "green";
    }

    if(dataValid(newDateIndex - 61, newDateIndex)){
        document.querySelector("#myCanvas").style.display = "block";
        badData.style.display = "none";

        main.style.flexDirection = "row";
        main.style.justifyContent = "space-around";

        graph.clearData();
        let dateArr = [data[newDateIndex - 60].date, data[newDateIndex].date];
        graph.addData(graphNewCases(60, newDateIndex), dateArr, "New Cases");
        graph.addData(graphNewDeaths(60, newDateIndex), dateArr, "New Deaths");
    }else{
        document.querySelector("#myCanvas").style.display = "none";
        badData.innerText = "INCOMPLETE DATA FOR GRAPHING";
        badData.style.display = "block";
        
        main.style.flexDirection = "column";
        main.style.alignItems = "center";
    }

    if(window.location.href.includes("us/")){
        document.querySelector("#mortality").parentElement.style.display = "none";
    }
}

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
    form.submit();
}

dataChange();