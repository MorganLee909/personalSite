for(let point of data){
    point.date = new Date(point.date);
    point.date.setDate(point.date.getDate() - 1);
}

let latestDate = data[data.length-1].date;
let url = window.location.href;
let displayLocation = url.slice(url.indexOf("corona") + 7);
switch(displayLocation){
    case "us": displayLocation = "USA"; break;
    case "china": displayLocation = "China"; break;
    case "taiwan": displayLocation = "Taiwan"; break;
    case "canada": displayLocation = "Canada"; break;
    case "russia": displayLocation = "Russia"; break;
    default: displayLocation = "World";
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
    percentYesterday.innerText = `${Math.abs(percent).toFixed(2)}% fewer cases than previous day`;
    percentYesterday.style.color = "green";
}

let percent7Day = document.querySelector("#percent7Day");
percent = calculateGrowth(data[data.length-1].newCases, calculateNewCaseAverage(7, latestDate));
if(percent > 0){
    percent7Day.innerText = `${percent.toFixed(2)}% more cases than 7-day average`;
    percent7Day.style.color = "red";
}else{
    percent7Day.innerText = `${Math.abs(percent).toFixed(2)}% fewer cases than 7-day average`;
    percent7Day.style.color = "green";
}

let percent30Day = document.querySelector("#percent30Day");
percent = calculateGrowth(data[data.length-1].newCases, calculateNewCaseAverage(30, latestDate));
if(percent > 0){
    percent30Day.innerText = `${percent.toFixed(2)}% more cases than 30-day average`;
    percent30Day.style.color = "red";
}else{
    percent30Day.innerText = `${Math.abs(percent).toFixed(2)}% fewer cases than 30-day average`;
    percent30Day.style.color = "green";
}

let percentAverages = document.querySelector("#percentAverages");
percent = calculateGrowth(calculateNewCaseAverage(7, latestDate), calculateNewCaseAverage(30, latestDate));
if(percent > 0){
    percentAverages.innerText = `7-day average is ${percent.toFixed(2)}% higher than the 30-day average`;
    percentAverages.style.color = "red";
}else{
    percentAverages.innerText = `7-day average is ${Math.abs(percent).toFixed(2)}% lower than the 30-day average`;
    percentAverages.style.color = "green";
}

let isComment = false;
for(let comment of comments){
    if(
        latestDate.getFullYear() === comment.year &&
        latestDate.getMonth() === comment.month - 1 &&
        latestDate.getDate() === comment.day
    ){
        document.querySelector(".comments p").innerText = comment.comment;
        isComment = true;
        break;
    }
}

if(!isComment){
    document.querySelector(".comments p").innerText = "No comments for this day";
}

//Graphing
let graphDataValid = function(startIndex, endIndex){
    let isValid = true;
    for(let i = startIndex; i < endIndex; i++){
        let nextDay = new Date(data[i].date.getTime());
        nextDay = new Date(nextDay.setDate(nextDay.getDate() + 1));
        if(nextDay.getTime() !== data[i+1].date.getTime()){
            isValid = false;
            break;
        }
    }

    return isValid;
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

let main = document.querySelector(".horizontal");
if(graphDataValid(data.length - 31, data.length -1)){
    
    let canvas = document.createElement("canvas");
    main.appendChild(canvas);

    let graph = new LineGraph(
        canvas,
        "",
        "Date"
    )
    
    let date1 = data[data.length-31].date;
    let date2 = data[data.length-1].date;
    let dateArr = [date1, date2];
    graph.addData(graphNewCases(30), dateArr, "New Cases");
    graph.addData(graphNewDeaths(30), dateArr, "New Deaths");
}else{
    let badData = document.createElement("p");
    badData.innerText = "INCOMPLETE DATA FOR GRAPHING";
    badData.style.marginTop = "10px";
    badData.style.color = "red";
    badData.style.fontWeight = "bold";
    main.insertBefore(badData, document.querySelector(".stats"));

    main.style.flexDirection = "column";
    main.style.alignItems = "center";
}

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
        percentYesterday.innerText = `${Math.abs(percent).toFixed(2)}% fewer cases than previous day`;
        percentYesterday.style.color = "green";
    }

    let percent7Day = document.querySelector("#percent7Day");
    percent = calculateGrowth(data[newDateIndex].newCases, calculateNewCaseAverage(7, date));
    if(percent > 0){
        percent7Day.innerText = `${percent.toFixed(2)}% more cases than 7-day average`;
        percent7Day.style.color = "red";
    }else{
        percent7Day.innerText = `${Math.abs(percent).toFixed(2)}% fewer cases than 7-day average`;
        percent7Day.style.color = "green";
    }

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

    let isComment = false;
    for(let comment of comments){
        if(
            date.getFullYear() === comment.year &&
            date.getMonth() === comment.month - 1 &&
            date.getDate() === comment.day
        ){
            document.querySelector(".comments p").innerText = comment.comment;
            isComment = true;
            break;
        }
    }

    if(!isComment){
        document.querySelector(".comments p").innerText = "No comments for this day";
    }

    graph.clearData();
    let dateArr = [data[newDateIndex - 30].date, data[newDateIndex].date];
    graph.addData(graphNewCases(30, newDateIndex), dateArr, "New Cases");
    graph.addData(graphNewDeaths(30, newDateIndex), dateArr, "New Deaths");
}
