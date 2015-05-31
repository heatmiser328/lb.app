var battles = require("../data/battles.json");
var _ = require('lodash');

module.exports = {
	all: function() {
    	return battles;
    },
    findByScenario: function(id) {
    	var data = {};
        
        data.battle = _.find(battles, function(battle) {
        	data.scenario = _.find(battle.scenarios, function(scenario) {
            	return scenario.id === id;
            });
        	return !!data.scenario;
        });
        
        return data;
    }
};