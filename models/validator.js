module.exports = {
    isSanitary: function(str){
        let disallowed = ["\\", "<", ">", "$", "{", "}", "(", ")"];

        for(let j = 0; j < disallowed.length; j++){
            if(str.includes(disallowed[j])){
                return false;
            }
        }

        return true;
    }
}