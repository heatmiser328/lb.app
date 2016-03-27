var _ = require('lodash');
var Sound = require('../core/sound.js');


function Die(low, high, diecolor, dotcolor) {
	var self = this;
    var value = low;
    diecolor = diecolor || 'white';
	dotcolor = dotcolor || 'black';

	function randomBetween(low, high) {
		return Math.floor(Math.random()*(high-low+1)) + low;
	}

	self.diecolor = function(c) {
		if (typeof c != 'undefined') {
        	diecolor = c;
        }
        return diecolor;
	}
	self.dotcolor = function(c) {
		if (typeof c != 'undefined') {
        	dotcolor = c;
        }
        return dotcolor;
	}

    self.value = function(d) {
    	if (typeof d != 'undefined') {
        	value = d;
            if (value < low) {
            	value = low;
            } else if (value > high) {
            	value = high;
            }
        }
        return value;
    }

    self.increment = function(rollover) {
    	if (++value > high) {
        	value = rollover ? low : high;
        }
    }
    self.decrement = function(rollover) {
    	if (--value < low) {
        	value = rollover ? high : low;
        }
    }
    self.roll = function() {
    	value = randomBetween(low, high);
        return value;
    }
}

function Dice(opts) {
	var self = this;
    var dice = [];
    opts = opts || [{num: 1, low: 1, high: 6, diecolor: 'white', dotcolor: 'black'}];
    _.each(opts, function(opt) {
    	_.each(_.range(opt.num), function(i) {
	    	dice.push(new Die(opt.low, opt.high, opt.diecolor, opt.dotcolor));
        });
    });

	self.count = function() {
    	return dice.length;
    }

    self.each = function(callback) {
    	_.each(dice, function(die, index) {
        	callback(die, index);
        });
    }

    self.dice = function() {
        return _.map(dice, function(die) {
        	return die.value();
        });
    }

    self.dieEx = function(i) {
    	if (--i >= 0 && i < dice.length) {
        	return dice[i];
        }
        return {};
    }

    self.die = function(i, d) {
    	var o = self.dieEx(i);
    	if (typeof d != 'undefined' && o.hasOwnProperty('value')) {
        	o.value(d);
        }
        return o.hasOwnProperty('value') ? o.value() : 0;
    }

    self.roll = function(i) {
    	if (typeof i != 'undefined') {
        	var d = self.dieEx(i);
            if (d && d.hasOwnProperty('roll')) {
            	d.roll();
                return d.value();
            }
            return 0;
        }

        Sound.play();
    	for (var i=0; i<dice.length; i++) {
        	dice[i].roll();
        }
    }
}

module.exports = {
	Die: Die,
	Dice: Dice
};
