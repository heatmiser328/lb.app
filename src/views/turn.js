var Current = require('../core/current.js');
var Phases = require('../core/phases.js');
var Spinner = require('../widgets/spinner.js');
var config = require('../config.js');
var log = require('../core/log.js');

function formatTurn(dt) {
    var str = dt.format("MMM DD, YYYY HH:mm");
	log.debug('turn: ' + str);
    return str;
}


function create(data) {
    var composite = tabris.create("Composite", {
        highlightOnTouch: true
	});

    // header
    var imageView = tabris.create("ImageView", {
    	layoutData: {left: config.PAGE_MARGIN, top: config.PAGE_MARGIN/2, width: 96, height: 144},
        image: 'images/' + data.battle.image
	}).appendTo(composite);

    var nameView = tabris.create("TextView", {
    	text: data.scenario.name,
    	layoutData: {left: [imageView, config.PAGE_MARGIN], top: config.PAGE_MARGIN}
        //,background: "rgba(0, 0, 0, 0.1)"
	}).appendTo(composite);

    // current
    var compositeTurn = tabris.create("Composite", {
    	layoutData: {left: [imageView, config.PAGE_MARGIN], top: [nameView, 10]},
        highlightOnTouch: true
    });
    // date/time
    var spinTurn = Spinner.create(null, formatTurn(Current.turn()), false, {left: 0, right: [0,3], top: 0}, function(valueView, incr) {
		var turn = (incr > 0) ? Current.nextTurn() : Current.prevTurn();
    	valueView.set("text", formatTurn(turn));
	}).appendTo(compositeTurn);
    // phase
    var spinPhase = Spinner.create(null, Current.phase(), false, {left: 0, right: [0,3], top: [spinTurn,0]}, function(valueView, incr) {
		var phase = (incr > 0) ? Current.nextPhase() : Current.prevPhase();
    	valueView.set("text", phase);
        spinTurn.setValue(formatTurn(Current.turn()));
	}).appendTo(compositeTurn);
    compositeTurn.appendTo(composite);

    composite.reset = function() {
    	spinTurn.setValue(formatTurn(Current.turn()));
    	spinPhase.setValue(Current.phase());
    }

	return composite;
}


module.exports = {
	create: function(data) {
    	log.debug('Creating Turn for ' + data.battle.name);
    	return create(data);
    }
};
