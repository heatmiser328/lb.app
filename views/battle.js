var battles = require('../core/battles.js');

function show(data) {
	var page = tabris.create("Page", {
    	title: data.battle.name
	});
    
    tabris.create("TextView", {
    	text: data.scenario.name,
    	layoutData: {left: 14, top: 10},
        background: "rgba(0, 0, 0, 0.1)"
	}).appendTo(page);
    
    page.open();
}    


module.exports = {
	show: function(scenarioid) {
    	var data = battles.findByScenario(scenarioid);
    	show(data);
    }
};