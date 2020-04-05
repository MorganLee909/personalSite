let latestDate = new Date(data[data.length-1].date);
let url = window.location.href;
let displayLocation = url.slice(url.indexOf("corona") + 7);
switch(displayLocation){
    case "us": displayLocation = "United States of America"; break;
    case "russia": displayLocation = "Russia"; break;
    case "china": displayLocation = "China"; break;
    case "taiwan": displayLocation = "Taiwan"; break;
    case "canada": displayLocation = "Canada"; break;
    default: displayLocation = "World";
}

data

document.querySelector("#locationHeader").innerText = displayLocation;
document.querySelector("#dateHeader").innerText = latestDate.toDateString();
document.querySelector("#date").valueAsDate = latestDate;

//Left-hand data
let calculateTotalCases = function(endDate){
    let total = 0;
    for(let point of data){
        if(new Date(point.date) > endDate){
            break;
        }

        total += point.newCases;
    }

    return total;
}

let calculateTotalDeaths = function(endDate){
    let total = 0;
    for(let point of data){
        if(new Date(point.date) > endDate){
            break;
        }
        total += point.newDeaths;
    }

    return total;
}

let calculateNewCaseAverage = function(numDays, endDate){
    let total = 0;
    for(let i = 0; i < data.length; i++){
        let forDate = new Date(data[i].date);
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

document.querySelector("#totalCases").innerText = calculateTotalCases(latestDate);
document.querySelector("#totalDeaths").innerText = calculateTotalDeaths(latestDate);
document.querySelector("#newDeaths").innerText = data[data.length-1].newDeaths;

document.querySelector("#newCases").innerText = data[data.length-1].newCases;
document.querySelector("#newCaseAverage7").innerText = calculateNewCaseAverage(7, latestDate);
document.querySelector("#newCaseAverage30").innerText = calculateNewCaseAverage(30, latestDate);

let percentYesterday = document.querySelector("#percentYesterday");
let percent = calculateGrowth(data[data.length-1].newCases, data[data.length-2].newCases);
if(percent > 0){
    percentYesterday.innerText = `${percent.toFixed(2)}% more cases than previous day`;
    percentYesterday.style.color = "red";
}else{
    percentYesterday.innerText = `${percent.toFixed(2)}% fewer cases than previous day`;
    percentYesterday.style.color = "green";
}

let percent7Day = document.querySelector("#percent7Day");
percent = calculateGrowth(data[data.length-1].newCases, calculateNewCaseAverage(7, latestDate));
if(percent > 0){
    percent7Day.innerText = `${percent.toFixed(2)}% more cases than 7-day average`;
    percent7Day.style.color = "red";
}else{
    percent7Day.innerText = `${percent.toFixed(2)}% fewer cases than 7-day average`;
    percent7Day.style.color = "green";
}

let percent30Day = document.querySelector("#percent30Day");
percent = calculateGrowth(data[data.length-1].newCases, calculateNewCaseAverage(30, latestDate));
if(percent > 0){
    percent30Day.innerText = `${percent.toFixed(2)}% more cases than 30-day average`;
    percent30Day.style.color = "red";
}else{
    percent30Day.innerText = `${percent.toFixed(2)}% fewer cases than 30-day average`;
    percent30Day.style.color = "green";
}

//Graphing
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

let date1 = new Date(data[data.length-31].date);
let date2 = new Date(data[data.length-1].date);
let dateArr = [date1, date2];
graph.addData(graphTotalCases(30), dateArr, "Total Cases");
graph.addData(graphNewCases(30), dateArr, "New Cases");
graph.addData(graphTotalDeaths(30), dateArr, "Total Deaths");
graph.addData(graphNewDeaths(30), dateArr, "New Deaths");

//Data change
let dataChange = function(){

    let date = document.querySelector("#date").valueAsDate;
    let newDateIndex = 0;
    document.querySelector("#dateHeader").innerText = date.toDateString();

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
    
    document.querySelector("#totalCases").innerText = calculateTotalCases(date);
    document.querySelector("#totalDeaths").innerText = calculateTotalDeaths(date);
    document.querySelector("#newCases").innerText = data[newDateIndex].newCases;
    document.querySelector("#newDeaths").innerText = data[newDateIndex].newDeaths;
    document.querySelector("#newCaseAverage7").innerText = calculateNewCaseAverage(7, date);
    document.querySelector("#newCaseAverage30").innerText = calculateNewCaseAverage(30, date);

    let percentYesterday = document.querySelector("#percentYesterday");
    let percent = calculateGrowth(data[newDateIndex].newCases, data[newDateIndex-1].newCases);
    if(percent > 0){
        percentYesterday.innerText = `${percent.toFixed(2)}% more cases than previous day`;
        percentYesterday.style.color = "red";
    }else{
        percentYesterday.innerText = `${percent.toFixed(2)}% fewer cases than previous day`;
        percentYesterday.style.color = "green";
    }

    let percent7Day = document.querySelector("#percent7Day");
    percent = calculateGrowth(data[newDateIndex].newCases, calculateNewCaseAverage(7, date));
    if(percent > 0){
        percent7Day.innerText = `${percent.toFixed(2)}% more cases than 7-day average`;
        percent7Day.style.color = "red";
    }else{
        percent7Day.innerText = `${percent.toFixed(2)}% fewer cases than 7-day average`;
        percent7Day.style.color = "green";
    }

    let percent30Day = document.querySelector("#percent30Day");
    percent = calculateGrowth(data[newDateIndex].newCases, calculateNewCaseAverage(30, date));
    if(percent > 0){
        percent30Day.innerText = `${percent.toFixed(2)}% more cases than 30-day average`;
        percent30Day.style.color = "red";
    }else{
        percent30Day.innerText = `${percent.toFixed(2)}% fewer cases than 30-day average`;
        percent30Day.style.color = "green";
    }


    graph.clearData();
    let dateArr = [new Date(data[newDateIndex - 30].date), new Date(data[newDateIndex].date)];
    graph.addData(graphTotalCases(30, newDateIndex), dateArr, "Total Cases");
    graph.addData(graphNewCases(30, newDateIndex), dateArr, "New Cases");
    graph.addData(graphTotalDeaths(30, newDateIndex), dateArr, "Total Deaths");
    graph.addData(graphNewDeaths(30, newDateIndex), dateArr, "New Deaths");
}
