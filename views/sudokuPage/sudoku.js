let sudokuObj = {
    arr: [],
    emptyX: [],
    emptyY: [],
    count: 0,
    
    display: function(){
        controller.clearScreen();
        controller.sudokuStrand.style.display = "flex";

        let tbody = document.querySelector("tbody");

        for(let y = 0; y < 9; y++){
            let row = document.createElement("tr");
            tbody.appendChild(row);

            for(let x = 0; x < 9; x++){
                let td = document.createElement("td");
                row.appendChild(td);

                let cell = document.createElement("input");
                cell.type = "text";
                td.appendChild(cell);
            }
        }
    },

    solve: function(){
        this.getInputs();
        this.recurse(0);
        this.fillIn();
    },

    getInputs: function(){
        let tbody = document.querySelector("tbody");
        
        for(let row of tbody.children){
            rowArr = [];
            for(let td of row.children){
                let rowValue = td.children[0].value;
                if(rowValue === ""){
                    rowArr.push(0);
                }else{
                    rowArr.push(parseInt(rowValue));
                }
            }

            this.arr.push(rowArr);
        }

        //Make a note of all empty spots
        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                if(this.arr[y][x] === 0){
                    this.emptyY.push(y);
                    this.emptyX.push(x);
                }
            }
        }
    },

    recurse: function(emptyIndex){
        this.count++;
        if(emptyIndex === this.emptyX.length){
            return true;
        }

        for(let n = 1; n <= 9; n++){
            if(this.isValid(this.emptyY[emptyIndex], this.emptyX[emptyIndex], n)){
                this.arr[this.emptyY[emptyIndex]][this.emptyX[emptyIndex]] = n;
                let isDone = this.recurse(emptyIndex + 1);
                if(isDone){
                    return true;
                }
            }
        }

        this.arr[this.emptyY[emptyIndex]][this.emptyX[emptyIndex]] = 0;  
    },


    isValid: function(y, x, n){
        for(let y2 = 0; y2 < 9; y2++){
            if(this.arr[y2][x] === n){
                return false;
            }
        }
    
        for(let x2 = 0; x2 < 9; x2++){
            if(this.arr[y][x2] === n){
                return false;
            }
        }
    
        let squareInputs = [this.getArrForBox(y), this.getArrForBox(x)];
        for(let i of squareInputs[0]){
            for(let j of squareInputs[1]){
                if(this.arr[i][j] === n){
                    return false;
                }
            }
        }
    
        return true;
    },

    getArrForBox: function(coord){
        let coords = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
        for(let set of coords){
            for(let num of set){
                if(num === coord){
                    return set;
                }
            }
        }
    },

    fillIn: function(){
        let tbody = document.querySelector("tbody");

        for(let i = 0; i < 9; i++){
            let row = tbody.children[i];
            for(let j = 0; j < 9; j++){
                row.children[j].children[0].value = this.arr[i][j];
            }
        }
    },

    reset: function(){
        let tbody = document.querySelector("tbody");

        for(let row of tbody.children){
            for(let td of row.children){
                td.children[0].value = "";
            }
        }

        this.arr = [];
        this.emptyX = [];
        this.emptyY = [];
        this.count = 0;
    }
}