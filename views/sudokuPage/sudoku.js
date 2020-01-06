let emptyX = [];
let emptyY = [];
let arr;
let count = 0;

let getUnfilled = ()=>{
    let newArr = [];
    
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            if(arr[y][x].length !== 1){
                emptyY.push(y);
                emptyX.push(x);
            }
        }
    }
}

let getArrForBox = (coord)=>{
    let coords = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    for(let set of coords){
        for(let num of set){
            if(num === coord){
                return set;
            }
        }
    }
}

let fillIn = ()=>{
    let inputs = document.querySelectorAll("input");
    let count = 0;

    for(let y = 0; y < arr.length; y++){
        for(let x = 0; x < arr[y].length; x++){
            if(arr[y][x].length === 1){
                inputs[count].value = arr[y][x][0];
            }
            count++;
        }
    }
}

let createArray = ()=>{
    let inputs = document.querySelectorAll("input");
    arr = new Array(9);
    let count = 0;

    for(let i = 0; i < arr.length; i++){
        arr[i] = new Array(9);
        for(let j = 0; j < arr[i].length; j++){
            let input;
            if(inputs[count].value !== ""){
                input = [parseInt(inputs[count].value)];
            }else{
                input = [];
            }
            arr[i][j] = input;
            count++;
        }
    }
}

let isValid = (y, x, n)=>{

    for(let y2 = 0; y2 < 9; y2++){
        if(arr[y2][x].length === 1 && arr[y2][x][0] === n){
            return false;
        }
    }

    for(let x2 = 0; x2 < 9; x2++){
        if(arr[y][x2].length === 1 && arr[y][x2][0] === n){
            return false;
        }
    }

    let squareInputs = [getArrForBox(y), getArrForBox(x)];
    for(let i of squareInputs[0]){
        for(let j of squareInputs[1]){
            if(arr[i][j].length === 1 && arr[i][j][0] === n){
                return false;
            }
        }
    }

    return true;
}

let recurse = (emptyIndex)=>{
    count++;
    if(emptyIndex === emptyX.length){
        return true;
    }
    for(let n = 1; n <= 9; n++){
        if(isValid(emptyY[emptyIndex], emptyX[emptyIndex], n)){
            arr[emptyY[emptyIndex]][emptyX[emptyIndex]][0] = n;
            let isDone = recurse(emptyIndex + 1);
            if(isDone){
                return true;
            }
        }
    }
    arr[emptyY[emptyIndex]][emptyX[emptyIndex]] = [];
    
}

let solveSudoku = ()=>{
    createArray();
    getUnfilled();

    recurse(0);

    fillIn();
    console.log(count);
}

let body = document.querySelector("body");
let container = document.createElement("div");

container.className ="container";
body.appendChild(container);

for(let y = 0; y < 9; y++){
    let row = document.createElement("div");
    for(let x = 0; x < 9; x++){
        let cell = document.createElement("input");
        cell.type = "text";
        row.appendChild(cell);
    }
    container.appendChild(row);
}

let solver = document.createElement("button");
solver.innerText = "Solve";
solver.onclick = solveSudoku;
body.appendChild(solver);