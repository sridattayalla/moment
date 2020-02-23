const LocaleSupport = require('./LocaleSupport');

class MomentFormator{
    constructor(momentContainer, Format) {
        this.momentContainer = momentContainer;
        this.format = Format ? Format : "YYYY-MM-DD HH:mm:ss.SSS Z";
    }

    formatTime(){
        let tokensToReplace = {};
        let momentContainer = (this.momentContainer).moment;
        let format = this.format;
        Object.keys(momentContainer).forEach(function (key){
            while(format.includes(key)){
                let pos = format.indexOf(key);
                console.log(key , pos)
                format = format.replace(new RegExp(key), '````````'.substring(0, key.length));
                //console.log(format)
                tokensToReplace[pos] = {'len': key.length, 'val': momentContainer[key].toString()}
            }
        })

        console.log(format)
        console.log(tokensToReplace)
        let indexPos = 0;
        let temp = "";
        Object.keys(tokensToReplace).forEach(function (pos) {
            let len = tokensToReplace[pos]['len'];
            temp += format.substring(indexPos, parseInt(pos)) + tokensToReplace[pos]['val'];
            indexPos = parseInt(pos) + len;
        })
        temp += format.substring(indexPos, format.length);

        return temp;
    }
}

module.exports = MomentFormator;