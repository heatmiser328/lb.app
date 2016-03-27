var Odds = require('../core/odds.js');
var Base6 = require('../core/base6.js');
var _ = require('lodash');

var table = [
    {desc:'1:3',value:-3},
    {desc:'1:2.5',value:-2.5},
    {desc:'1:2',value:-2},
    {desc:'1:1.5',value:-1.5},
    {desc:'1:1',value:1},
    {desc:'1.5:1',value:1.5},
    {desc:'2:1',value:2},
    {desc:'2.5:1',value:2.5},
    {desc:'3:1',value:3},
    {desc:'4:1',value:4},
    {desc:'5:1',value:5},
    {desc:'6:1',value:6},
    {desc:'7:1',value:7},
    {desc:'8:1',value:8},
    {desc:'9:1',value:9},
    {desc:'10:1',value:10}
];
var odds = Odds(table);

function calculate(attack, defend, cannister) {
    var o = odds.calculate(attack, defend, cannister ? 1 : 0);
    return (o || table[4]).desc;
}

function resolve(o, dice, defincr) {
    if (defincr > 9) {
        dice = Base6.add(dice, defincr - 9);
    }
    var idx = _.findIndex(table, (v) => {return v.desc == o;});
    var result = "NE";
    switch (idx)
    {
        case 0:		//1-3
            if (dice >= 65) {
                result = "1";
            }
            break;
        case 1:		//1-2.5
            if (dice >= 64) {
                result = "1";
            }
            break;
        case 2:		//1-2
            if (dice >= 62) {
                result = "1";
            }
            break;
        case 3:		//1-1.5
            if (dice >= 55) {
                result = "1";
            }
            break;
        case 4:		//1-1
            if (dice >= 51) {
                result = "1";
            }
            break;
        case 5:		//1.5-1
            if (dice >= 42) {
                result = "1";
            }
            break;
        case 6:		//2-1
            if (dice >= 33) {
                result = "1";
            }
            break;
        case 7:		//2.5-1
            if (dice >= 64) {
                result = "2";
            }
            else if (dice >= 26) {
                result = "1";
            }
            break;
        case 8:		//3-1
            if 	(dice >= 56) {
                result = "2";
            }
            else if (dice >= 22) {
                result = "1";
            }
            break;
        case 9:		//4-1
            if (dice >= 54) {
                result = "2";
            }
            else if (dice >= 13) {
                result = "1";
            }
            break;
        case 10:	//5-1
            if (dice >= 66) {
                result = "3";
            }
            else if (dice >= 45) {
                result = "2";
            }
            else if (dice >= 11) {
                result = "1";
            }
            break;
        case 11:	//6-1
            if (dice >= 62) {
                result = "3";
            }
            else if (dice >= 33) {
                result = "2";
            }
            else if (dice >= 11) {
                result = "1";
            }
            break;
        case 12:	//7-1
            if (dice >= 52) {
                result = "3";
            }
            else if (dice >= 23) {
                result = "2";
            }
            else if (dice >= 11) {
                result = "1";
            }
            break;
        case 13:	//8-1
            if (dice >= 66) {
                result = "4";
            }
            else if (dice >= 45) {
                result = "3";
            }
            else if (dice >= 15) {
                result = "2";
            }
            else if (dice >= 11) {
                result = "1";
            }
            break;
        case 14:	//9-1
            if (dice >= 63) {
                result = "4";
            }
            else if (dice >= 42) {
                result = "3";
            }
            else if (dice >= 11) {
                result = "2";
            }
            break;
        case 15:	//10-1
            if (dice >= 65) {
                result = "5";
            }
            else if (dice >= 55) {
                result = "4";
            }
            else if (dice >= 26) {
                result = "3";
            }
            else if (dice >= 11) {
                result = "2";
            }
            break;

        default:
            result = "NE";
            break;
    }

    /*
    if (dice >= 65) {
        result += " &";
    }
    */

    return result;
}

module.exports = {
    odds: _.map(table, (o) => {return o.desc;}),
    defaultOdds: table[4].desc,
    calculate: calculate,
    resolve: resolve
};
