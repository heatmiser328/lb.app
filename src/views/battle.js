var Battles = require('../core/battles.js');
var Current = require('../core/current.js');
var Turn = require('../views/turn.js');
var Fire = require('../views/fire.js');
var log = require('../core/log.js');

function createTab(title, image, tabcontent) {
	var tab = new tabris.Tab({
	    title: title, // converted to upper-case on Android
	    image: {src: image, scale: 2}
	});
	tabcontent = tabcontent || new tabris.TextView({
	    layoutData: {centerX: 0, centerY: 0},
	    text: "Content of Tab " + title
	});

	/*
	var tab = tabris.create("Tab", {
    	layoutData: {left: 0, right: 0, top: 0, bottom: 0},
    	title: title, // converted to upper-case on Android
        image: {src: image, scale: 2} // image only used by iOS
	});
    tabcontent = tabcontent || tabris.create("TextView", {
    	layoutData: {centerX: 0, centerY: 0},
        text: "Content of Tab " + title
	});
	*/
    tabcontent.appendTo(tab);
    tab.reset = tabcontent.reset || function() {};

    return tab;
}

var btnReset;

function show(data) {
	var tabs = [];
	var page = tabris.create("Page", {
    	title: data.battle.name
	});

    btnReset = btnReset ||
	    tabris.create("Action", {
	    	image: "images/refresh.png"
		}).on("select", function() {
	    	log.debug('Reset ' + data.battle.name);
	    	Current.reset(data);
	        turnView.reset();
	        tabs.forEach(function(tab) {
	        	if (tab.reset && typeof tab.reset == 'function') {
	            	tab.reset();
	            }
	        });
		});

    var turnView = Turn.create(data);
    turnView.appendTo(page);

    // tabs
    var folder = tabris.create("TabFolder", {
		layoutData: {left: 0, top: [turnView, 10], right: 0, bottom: 0},
	    paging: true // enables swiping. To still be able to open the developer console in iOS, swipe from the bottom right.
	});

    tabs.push(createTab('Fire', 'images/fire.png', Fire.create(data.battle)).appendTo(folder));
    tabs.push(createTab('Melee', 'images/melee.png').appendTo(folder));
    tabs.push(createTab('Morale', 'images/morale.png').appendTo(folder));
    tabs.push(createTab('General', 'images/dice.png').appendTo(folder));

    folder.appendTo(page);

    page.open();
}

module.exports = {
	show: function(scenarioid) {
    	var data = Battles.findByScenario(scenarioid);
    	show(data);
    }
};
