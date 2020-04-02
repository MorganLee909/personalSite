let birthdayParadoxObj = {
    partiers: 23,
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

    display: function(){
        let datesDiv = document.querySelector("#datesDiv");

        document.querySelector("#partiers").value = this.partiers;

        while(datesDiv.children.length > 0){
            datesDiv.removeChild(datesDiv.firstChild);
        }

        let nums = [];
        for(let i = 0; i < this.partiers; i++){
            let num = Math.floor((Math.random() * 366) + 1);
            if(num === 60){
                i--;
            }else{
                nums.push(num);
            }
        }

        let matches = [];
        for(let i = 0; i < nums.length; i++){
            for(let j = i + 1; j < nums.length; j++){
                if(nums[i] === nums[j]){
                    matches.push(nums[i]);
                    break;
                }
            }
        }

        for(let num of nums){
            let date = new Date(2020, 0);
            date = new Date(date.setDate(num));

            let para = document.createElement("p");
            para.classList = "date";
            para.innerText = `${this.months[date.getMonth()]} ${date.getDate()}`;
            datesDiv.appendChild(para);

            for(let match of matches){
                if(match === num){
                    para.classList += " match";
                    break;
                }
            }
        }

        this.calculateChance();
    },

    calculateChance: function(){
        let chance = document.querySelector("h3");
        let input = document.querySelector("#partiers");
        
        this.partiers = input.value;
        

        let percent = 1
        for(let i = 1; i < this.partiers; i++){
            percent *= (365 - i) / 365;
        }

        chance.innerText = `${(1 - percent) * 100}% chance of a match`;
    }
}

birthdayParadoxObj.display();