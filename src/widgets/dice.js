var Dice = require('../core/dice.js');
var Die = require('../widgets/die.js');
var config = require('../config.js');
var _ = require('lodash');


function create(dieopts, layout, handler) {
	var dice = new Dice.Dice(dieopts);

	var composite = tabris.create("Composite", {
    	layoutData: layout,
        highlightOnTouch: true
	});
	    var btnRoll = tabris.create("Button", {
	    	layoutData: {left: 0, centerY: 0},
	    	text: "Roll",
	        image: 'images/dice/droll.png'
		}).on("select", function() {
	    	dice.roll();
	        // update the dice images
	        dice.each(function(die, i) {
	        	die.view.set(die.value());
	        });
	    	handler(dice.dice());
	    }).appendTo(composite);

	    var leftOf = btnRoll;
	    dice.each(function(die, i) {
	    	die.view = Die.create({left: [leftOf, 5], top: 6, width: 40, height: 40}, die.diecolor(), die.dotcolor(), die.value())
	        .on('tap', function(widget, opt) {
	        	die.increment(true);
	        	die.view.set(die.value());
	            handler(dice.dice());
	        })
	        .appendTo(composite);

	        leftOf = die.view;
	    });

	composite.setDie = (d, v) => {
		var die = dice.dieEx(d);
		die.value(v)
		die.view.set(v);
	}

    composite.dice = function() {
    	return dice.dice();
    }

    return composite;
}


module.exports = {
	create: function(dieopts, layout, handler) {
    	return create(dieopts, layout, handler);
    }
};
