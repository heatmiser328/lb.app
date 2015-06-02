var battles = require('../core/battles.js');
var config = require('../views/config.js');
var moment = require("moment");

function formatDate(dt) {
	var d = moment({year: dt.year, month: dt.month, day: dt.day, hour: dt.hour, minute: dt.minute});
    return d.format("MMM DD, YYYY HH:mm A");
}

function createTab(title, image) {
	var tab = tabris.create("Tab", {
    	title: title, // converted to upper-case on Android
        image: {src: image, scale: 2} // image only used by iOS
	});
    tabris.create("TextView", {
    	layoutData: {centerX: 0, centerY: 0},
        text: "Content of Tab " + title
	}).appendTo(tab);
    return tab;
}


function show(data) {
	var page = tabris.create("Page", {
    	title: data.battle.name
	});
    
    var composite = tabris.create("Composite", {
    	background: "white",
        highlightOnTouch: true
	});
    
    var imageView = tabris.create("ImageView", {
    	layoutData: {left: config.PAGE_MARGIN, top: config.PAGE_MARGIN},
        image: 'images/' + data.battle.image
	}).appendTo(composite);
    
    var nameView = tabris.create("TextView", {
    	text: data.scenario.name,
    	layoutData: {left: [imageView, config.PAGE_MARGIN], top: config.PAGE_MARGIN},
        background: "rgba(0, 0, 0, 0.1)"
	}).appendTo(composite);
    
    // current
    var compositeTurn = tabris.create("Composite", {
    	layoutData: {left: [imageView, config.PAGE_MARGIN], top: [nameView, 10]},
    	background: "white",
        highlightOnTouch: true
    });
    // date/time
	var count = 0;
    var compositeDate = tabris.create("Composite", {
    	layoutData: {centerX: 0, top: 0},
    	background: "white",
        highlightOnTouch: true
    });
	    var prevDateBtn = tabris.create("Button", {
	    	layoutData: {left: 0, top: 0},
	        text: "<"
		}).on("select", function() {
	    	dateView.set("text", "Pressed " + (--count) + " times");
		}).appendTo(compositeDate);
	    
	    var dateView = tabris.create("TextView", {
	    	text: formatDate(data.scenario.start),
	    	layoutData: {left: [prevDateBtn,0], centerY: 0}
		}).appendTo(compositeDate);
	    
	    var nextDateBtn = tabris.create("Button", {
	    	layoutData: {left: [dateView,0], top: 0},
	        text: ">"
		}).on("select", function() {
	    	dateView.set("text", "Pressed " + (++count) + " times");
		}).appendTo(compositeDate);
    compositeDate.appendTo(compositeTurn);
    
    // phase
    var compositePhase = tabris.create("Composite", {
    	layoutData: {centerX: 0, top: [compositeDate, 0]},
    	background: "white",
        highlightOnTouch: true
    });
	    var prevPhaseBtn = tabris.create("Button", {
	    	layoutData: {left: 0, top: 0},
	        text: "<"
		}).on("select", function() {
	    	dateView.set("text", "Pressed " + (--count) + " times");
		}).appendTo(compositePhase);
	    
	    var phaseView = tabris.create("TextView", {
	    	text: 'Command',
	    	layoutData: {left: [prevPhaseBtn,0], centerY: 0}
		}).appendTo(compositePhase);
        
	    var nextPhaseBtn = tabris.create("Button", {
	    	layoutData: {left: [phaseView,0], top: 0},
	        text: ">"
		}).on("select", function() {
	    	dateView.set("text", "Pressed " + (++count) + " times");
		}).appendTo(compositePhase);
    compositePhase.appendTo(compositeTurn);
    
    compositeTurn.appendTo(composite);
    
    composite.appendTo(page);
    
    var folder = tabris.create("TabFolder", {
		layoutData: {left: 0, top: [composite, 10], right: 0, bottom: 0},
	    paging: true // enables swiping. To still be able to open the developer console in iOS, swipe from the bottom right.
	});
    createTab('Fire', 'images/fire.png').appendTo(folder);
    createTab('Melee', 'images/melee.png').appendTo(folder);
    createTab('Morale', 'images/morale.png').appendTo(folder);
    createTab('General', 'images/dice.png').appendTo(folder);
    folder.appendTo(page);
    
    page.open();
}    


module.exports = {
	show: function(scenarioid) {
    	var data = battles.findByScenario(scenarioid);
    	show(data);
    }
};