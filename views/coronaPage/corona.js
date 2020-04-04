let latestDate = new Date(data.us[data.us.length-1].date);
document.querySelector("h2").innerText = latestDate.toDateString();
document.querySelector("#date").valueAsDate = latestDate;

//Left-hand data
let calculateTotalCases = function(endDate){
    let total = 0;
    for(let point of data.us){
        if(new Date(point.date) > endDate){
            break;
        }

        total += point.newCases;
    }

    return total;
}

let calculateTotalDeaths = function(endDate){
    let total = 0;
    for(let point of data.us){
        if(new Date(point.date) > endDate){
            break;
        }
        total += point.newDeaths;
    }

    return total;
}

let calculateNewCaseAverage = function(numDays, endDate){
    let total = 0;
    for(let i = 0; i < data.us.length; i++){
        let forDate = new Date(data.us[i].date);
        if(
            forDate.getDate() === endDate.getDate() &&
            forDate.getMonth() === endDate.getMonth()
        ){
            for(let j = 0; j < numDays; j++){
                
                total += data.us[i-j].newCases;
            }
        }
    }

    return Math.round(total / numDays);
}

document.querySelector("#totalCases").innerText = calculateTotalCases(latestDate);
document.querySelector("#totalDeaths").innerText = calculateTotalDeaths(latestDate);
document.querySelector("#newCases").innerText = data.us[data.us.length-1].newCases;
document.querySelector("#newDeaths").innerText = data.us[data.us.length-1].newDeaths;
document.querySelector("#newCaseAverage7").innerText = calculateNewCaseAverage(7, latestDate);
document.querySelector("#newCaseAverage30").innerText = calculateNewCaseAverage(30, latestDate);

//Graphing
let graphTotalCases = function(numDays, endDateIndex = data.us.length - 1){
    let arr = [];
    let total = 0;
    for(let i = 0; i < data.us.length; i++){
        total += data.us[i].newCases;
        if(i >= endDateIndex - numDays){
            arr.push(total);
        }
        if(i >= endDateIndex){
            break;
        }
    }

    return arr;
}

let graphNewCases = function(numDays, endDateIndex = data.us.length - 1){
    let arr = [];
    for(let i = endDateIndex - numDays; i <= endDateIndex; i++){
        
        arr.push(data.us[i].newCases);
    }

    return arr;
}

let graphTotalDeaths = function(numDays, endDateIndex = data.us.length - 1){
    let arr = [];
    let total = 0;
    for(let i = 0; i < data.us.length; i++){
        total += data.us[i].newDeaths;
        if(i >= endDateIndex - numDays){
            arr.push(total);
        }
        if(i >= endDateIndex){
            break;
        }
    }

    return arr;
}

let graphNewDeaths = function(numDays, endDateIndex = data.us.length - 1){
    let arr = [];
    for(let i = endDateIndex - numDays; i <= endDateIndex; i++){
        arr.push(data.us[i].newDeaths);
    }

    return arr;
}
let canvas = document.querySelector("#myCanvas");
let graph = new LineGraph(
    canvas,
    "",
    "Date"
)

let date1 = new Date(data.us[data.us.length-31].date);
let date2 = new Date(data.us[data.us.length-1].date);
let dateArr = [date1, date2];
graph.addData(graphTotalCases(30), dateArr, "Total Cases");
graph.addData(graphNewCases(30), dateArr, "New Cases");
graph.addData(graphTotalDeaths(30), dateArr, "Total Deaths");
graph.addData(graphNewDeaths(30), dateArr, "New Deaths");

//Data change
let dataChange = function(){

    let date = document.querySelector("#date").valueAsDate;
    let newDateIndex = 0;
    document.querySelector("h2").innerText = date.toDateString();

    for(let i = 0; i < data.us.length; i++){
        let forDate = new Date(data.us[i].date);
        if(
            forDate.getDate() === date.getDate() &&
            forDate.getMonth() === date.getMonth()
        ){
            newDateIndex = i;
            break;
        }
    }
    
    document.querySelector("#totalCases").innerText = calculateTotalCases(date);
    document.querySelector("#totalDeaths").innerText = calculateTotalDeaths(date);
    document.querySelector("#newCases").innerText = data.us[newDateIndex].newCases;
    document.querySelector("#newDeaths").innerText = data.us[newDateIndex].newDeaths;
    document.querySelector("#newCaseAverage7").innerText = calculateNewCaseAverage(7, date);
    document.querySelector("#newCaseAverage30").innerText = calculateNewCaseAverage(30, date);

    graph.clearData();
    let dateArr = [new Date(data.us[newDateIndex - 30].date), new Date(data.us[newDateIndex].date)];
    graph.addData(graphTotalCases(30, newDateIndex), dateArr, "Total Cases");
    graph.addData(graphNewCases(30, newDateIndex), dateArr, "New Cases");
    graph.addData(graphTotalDeaths(30, newDateIndex), dateArr, "Total Deaths");
    graph.addData(graphNewDeaths(30, newDateIndex), dateArr, "New Deaths");
}