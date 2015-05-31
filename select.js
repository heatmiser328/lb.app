var config = require("./config.js");
var moment = require("moment");
var battles = require("./battles.json");
//var battle = require("./battle.js");
var drawer;

function createSelections() {
	drawer = tabris.create("Drawer").append(createBattlesList(battles));
}

function createBattlesList(battles) {
	return tabris.create("CollectionView", {
    	layoutData: {left: 0, right: 0, top: 0, bottom: 0},
	        itemHeight: 72,
            items: battles,
            initializeCell: function(cell) {
            	var imageView = tabris.create("ImageView", {
                	layoutData: {left: config.PAGE_MARGIN, centerY: 0, width: 32, height: 48},
                    scaleMode: "fit"
                    }).appendTo(cell);
				var titleTextView = tabris.create("TextView", {
                	layoutData: {left: 64, right: config.PAGE_MARGIN, top: config.PAGE_MARGIN},
                    markupEnabled: true,
                    textColor: "#4a4a4a"
				}).appendTo(cell);
                var publisherTextView = tabris.create("TextView", {
                	layoutData: {left: 64, right: config.PAGE_MARGIN, top: [titleTextView, 4]},
                    textColor: "#7b7b7b"
				}).appendTo(cell);
                cell.on("change:item", function(widget, battle) {
	                imageView.set("image", "images/" + battle.image);
                    titleTextView.set("text", battle.name);
                    publisherTextView.set("text", battle.publisher);
				});
			}
		}).on("select", function(target, battle) {
        	showScenarios(battle);
            drawer.close();
	});
}

function showScenarios(battle) {
	var page = tabris.create("Page", {
    	title: "Scenarios",
        image: "images/lb.png"
    });
    page.append(tabris.create("ImageView", {
    	id: "battleImageView",
    	image: "images/" + battle.image,
        layoutData: {left: config.PAGE_MARGIN, top: 0, width: 32, height: 48},
    	scaleMode: "fit"
	}));
    page.append(tabris.create("TextView", {
    	id: "battleTextView",
    	text: battle.name,
        layoutData: {left: 64, right: config.PAGE_MARGIN, top: 24}
    }));
    page.append(tabris.create("CollectionView", {
    	layoutData: {left: 0, right: 0, top: ['#battleImageView',10], bottom: 0},
	        itemHeight: 72,
            items: battle.scenarios,
            initializeCell: function(cell) {
				var titleTextView = tabris.create("TextView", {
                	layoutData: {left: config.PAGE_MARGIN, top: 0},
                    markupEnabled: true,
                    textColor: "#4a4a4a"
				}).appendTo(cell);
                var dateTextView = tabris.create("TextView", {
                	layoutData: {left: config.PAGE_MARGIN, top: [titleTextView, 4]},
                    textColor: "#7b7b7b"
				}).appendTo(cell);
                cell.on("change:item", function(widget, scenario) {
                    titleTextView.set("text", scenario.name);
                    var sd = moment({year: scenario.start.year, month: scenario.start.month, day: scenario.start.day, hour: scenario.start.hour, minute: scenario.start.minute});
                    var ed = moment({year: scenario.end.year, month: scenario.end.month, day: scenario.end.day, hour: scenario.end.hour, minute: scenario.end.minute});
                    var date = sd.format("MMMM DD, YYYY") + " " + sd.format("HH:mm") + " - " + ed.format("HH:mm");
                    dateTextView.set("text", date);
				});
			}
		}).on("select", function(target, value) {
        	console.log('Selected Scenario ' + value.name);
        	/*
        	battle.init(value);
            battle.show();
            */
	}));
    
    
    page.open();
    
}

module.exports = {
	init: function() {
    	createSelections();
    },
    show: function() {}
}