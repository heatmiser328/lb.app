var Battles = require('../core/battles.js');
var Phases = require('../core/phases.js');
var moment = require('moment');
var log = require('../core/log.js');
var KEY = 'lb.app.current';
var TURN_MINS = 20;

function load() {
	var d = localStorage.getItem(KEY);
    if (d) {
		return JSON.parse(d);
    }
}

function save(current) {
	localStorage.setItem(KEY, JSON.stringify(current));
}

function reset(data) {
	var current = {};
    current.battle = data.battle.id;
    current.scenario = data.scenario.id;
    current.turn = 1;
    current.phase = 0;
    save(current);
    return current;
}

function maxTurns(current) {
	var gamedata = Battles.findByScenario(current.scenario);
    var sd = moment({year: gamedata.scenario.start.year, month: gamedata.scenario.start.month-1, day: gamedata.scenario.start.day, hour: gamedata.scenario.start.hour, minute: gamedata.scenario.start.minute});
    var ed = moment({year: gamedata.scenario.end.year, month: gamedata.scenario.end.month-1, day: gamedata.scenario.end.day, hour: gamedata.scenario.end.hour, minute: gamedata.scenario.end.minute});
    var diff = ed.subtract(sd);
    var mins = (diff.hours()*60) + diff.minutes();
    return (mins / TURN_MINS) + 1;
}


module.exports = {
	get: function(data) {
    	var current = load();
        if (!current && data) {
        	current = reset(data);
        }
        return current;
    },
    reset: function(data) {
        reset(data);
    	return load();
    },
    phase: function(current) {
    	current = current || load();		
        return Phases.get(current.phase);
    },
    prevPhase: function(current) {
    	current = current || load();
        if (--current.phase < 0) {
        	current.phase = Phases.length - 1;
            this.prevTurn(current);
        }
        save(current);
        return this.phase(current);
    },
    nextPhase: function(current) {
    	current = current || load();
        if (++current.phase >= Phases.length) {
        	current.phase = 0;
            this.nextTurn(current);
        }
        save(current);
        return this.phase(current);
    },
    turn: function(current) {
    	current = current || load();
    	var gamedata = Battles.findByScenario(current.scenario);
        var d = moment({year: gamedata.scenario.start.year, month: gamedata.scenario.start.month-1, day: gamedata.scenario.start.day, hour: gamedata.scenario.start.hour, minute: gamedata.scenario.start.minute});
        var o = (current.turn - 1) * TURN_MINS;
        d.add(o, 'minutes');
		return d;
    },
    prevTurn: function(current) {
    	var dosave = !current;
    	current = current || load();
		log.debug('prev turn: ' + current.turn);
        if (--current.turn < 1) {
        	current.turn = 1;
        }
        if (dosave) {
        	save(current);
        }
        return this.turn(current);
    },
    nextTurn: function(current) {
    	var dosave = !current;
    	current = current || load();
		log.debug('next turn: ' + current.turn);

        var maxturns = maxTurns(current);
		log.debug('max turns: ' + maxturns);
        if (++current.turn >= maxturns) {
        	current.turn = maxturns;
        }
        if (dosave) {
        	save(current);
        }
        return this.turn(current);
    }
}
