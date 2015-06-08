var Battles = require('../core/battles.js');
var Phases = require('../core/phases.js');
var Current = require('../core/current.js');
var config = require('../views/config.js');

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

function createSpinLabel(relative, text, handler) {
    var composite = tabris.create("Composite", {
    	layoutData: {left: 0, right: [0,3], top: (relative ? [relative, 0] : 0)},
    	//background: "white",
        highlightOnTouch: true
    });
	    var prevBtn = tabris.create("Button", {
	    	layoutData: {left: 0, top: 0},
	        text: "<"
		}).on("select", function() {
        	handler(labelView, -1);
        }).appendTo(composite);
	    
	    var compositeLabelView = tabris.create("Composite", {
        	layoutData: {left: [prevBtn,2], right: [20,0], centerY: 0},
	    	//background: "green",
	        highlightOnTouch: true
	    });
		    var labelView = tabris.create("TextView", {
		    	text: text,
	    		layoutData: {centerX: 0, centerY: 0},
			}).appendTo(compositeLabelView);
		compositeLabelView.appendTo(composite);
	    
	    var nextBtn = tabris.create("Button", {
	    	layoutData: {left: [compositeLabelView,0], top: 0},
	        text: ">"
		}).on("select", function() {
        	handler(labelView, 1);
        }).appendTo(composite);
	
    composite.setLabel = function(text) {
    	labelView.set('text', text);
    }
    
    return composite;
}

function show(data, current) {
	var page = tabris.create("Page", {
    	title: data.battle.name
	});
    
    var composite = tabris.create("Composite", {
    	background: "white",
        highlightOnTouch: true
	});
    
    // header
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
    var spinTurn = createSpinLabel(null, Current.turn(), function(labelView, incr) {
		var turn = (incr > 0) ? Current.nextTurn() : Current.prevTurn();
    	labelView.set("text", turn);
	}).appendTo(compositeTurn);
    // phase
    createSpinLabel(spinTurn, Current.phase(), function(labelView, incr) {
		var phase = (incr > 0) ? Current.nextPhase() : Current.prevPhase();
    	labelView.set("text", phase);
        spinTurn.setLabel(Current.turn());
	}).appendTo(compositeTurn);
    compositeTurn.appendTo(composite);
    
    composite.appendTo(page);
    
    // tabs
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
    	var data = Battles.findByScenario(scenarioid);
        var current = Current.get(data);
    	show(data, current);
    }
};