var Dice = require('../widgets/dice.js');
var Spinner = require('../widgets/spinner.js');
var Fire = require('../core/fire.js');
var LeaderLoss = require('../core/leaderloss.js');
var Base6 = require('../core/base6.js');
var increment = require('../core/increment.js');
var config = require('../config.js');
var log = require('../core/log.js');

function createFire(layout, cb) {
	var composite = tabris.create('Composite', {
    	layoutData: layout
	});
		var attacker = createAttacker({left: 1, top: 2, right: '50%'}, cb)
		.appendTo(composite);
		var defender = createDefender({left: [attacker, 2], top: 2, right: 2}, cb)
		.appendTo(composite);

	composite.getAttack = attacker.getValue;
	composite.getCannister = attacker.getCannister;
	composite.getDefend = defender.getValue;
	composite.getIncr = defender.getIncr;

	return composite;
}

function createAttacker(layout, cb) {
	var cannister = false;
	var composite = tabris.create('Composite', {
    	layoutData: layout
	});
		var header = tabris.create("TextView", {
	    	text: "Attacker",
			font: 'bold 16px',
	    	layoutData: {centerX: 20, top: 2}
		}).appendTo(composite);

	    var value = Spinner.create(null, 1, true, {left: 0, right: [0,3], top: [header,5]}, function(valueView, incr) {
			var v = increment(parseInt(valueView.get('text')), incr, 1, 99);
	    	valueView.set('text', v);
			cb && cb(v);
		}).appendTo(composite);

		var values = createQuickValues({left: 0, right:[0,3], top: [value,1]}, [4,6,9,12,16,18], (v) => {
			value.setValue(v);
			cb && cb(v)
		}).appendTo(composite);

		var mods = createAttackMods({left: 0, right:[0,3], top: [values,1]}, ['1/3','1/2','3/2','Cannister'], (mod, b) => {
			var v = value.getValue();
			if (mod == 'Cannister') {
				cannister = b;
			} else if (mod == '1/3') {
				v = b ? v / 3 : v * 3;
			} else if (mod == '1/2') {
				v = b ? v / 2 : v * 2;
			} else if (mod == '3/2') {
				v = b ? v * 1.5 : v / 1.5;
			}
			value.setValue(v);
			cb && cb(v);
		}).appendTo(composite);

	composite.getValue = () => {
		return value.getValue();
	}
	composite.getCannister = () => {
		return cannister;
	}

	return composite;
}

function createAttackMods(layout, values, cb) {

	var composite = tabris.create('Composite', {
    	layoutData: layout
	});
		values.forEach((value, i) => {
			var buttonw = value.length * 20;
			new tabris.ToggleButton({
			  layoutData: {left: 'prev() 0', top: 0, width: buttonw, height: 45},
			  font: '16px',
			  text: value
		  	}).on('select', function(w,b) {
			  cb && cb(value,b);
			}).appendTo(composite);
		});
	return composite;
}

function createDefender(layout, cb) {
	var composite = tabris.create('Composite', {
    	layoutData: layout
	});
		var header = tabris.create("TextView", {
			text: "Defender",
			font: 'bold 16px',
			layoutData: {centerX: 20, top: 2}
		}).appendTo(composite);

		var value = Spinner.create(null, 1, true, {left: 0, right: [0,3], top: [header,5]}, function(valueView, incr) {
			var v = increment(parseInt(valueView.get('text')), incr, 1, 99);
	    	valueView.set('text', v);
			cb && cb();
		}).appendTo(composite);

		var values = createQuickValues({left: 0, right:[0,3], top: [value,3]}, [4,6,9,12,14,16], (v) => {
			value.setValue(v);
			cb && cb(v)
		}).appendTo(composite);

		var incr = Spinner.create('Incr', 1, true, {left: 0, right: [0,3], top: [values,3]}, function(valueView, incr) {
			var v = increment(parseInt(valueView.get('text')), incr, 1, 99);
	    	valueView.set('text', v);
			cb && cb();
		}).appendTo(composite);

	composite.getValue = () => {
		return value.getValue();
	}
	composite.getIncr = () => {
		return incr.getValue();
	}
	return composite;
}

function createQuickValues(layout, values, cb) {

	var composite = tabris.create('Composite', {
    	layoutData: layout
	});
		values.forEach((value) => {
			new tabris.Button({
			  layoutData: {left: 'prev() 0', top: 0, width: 47, height: 45},
			  font: '16px',
			  text: value
			}).on('select', function() {
			  cb && cb(value);
			}).appendTo(composite);
		});
	return composite;
}

function createOdds(layout, odds, cb) {
	var composite = tabris.create('Composite', {
    	layoutData: layout
	});
		var labelOdds = tabris.create('TextView', {
	    	text: 'Odds',
	        font: 'bold 20px',
	    	layoutData: {left: 2, top: 5}
		}).appendTo(composite);
		    var comboOdds = tabris.create('Picker', {
		    	layoutData: {left: [labelOdds, 5], top: 2},
		        font: '24px',
		        items: Fire.odds,
		        selection: Fire.defaultOdds
			}).on('change:selection', function(picker, item) {
	            cb && cb(item)
			}).appendTo(composite);
	composite.setOdds = (v) => {
		comboOdds.set('selection', v);
	}

	return composite;
}

function createOddsResults(layout, cb) {
	var composite = tabris.create('Composite', {
    	layoutData: layout
	});
		var odds = createOdds({left: 2, top: 2}, cb)
		.appendTo(composite);

		var results = tabris.create('TextView', {
	    	text: '',
	    	layoutData: {left: [odds, 25], top: 5, right: 5},
	        alignment: 'left',
	        font: 'bold 20px'
		}).appendTo(composite);

	composite.setOdds = odds.setOdds;
	composite.updateResults = (v) => {
		results.set('text', v);
	}

	return composite;
}

function createDiceMods(layout, cb) {
	var composite = tabris.create('Composite', {
    	layoutData: layout
	});
		var buttonw = 90;
		var buttonh = 55;
		['-6','-3','-1','/','+1','+3','+6'].forEach((mod, i) => {
			if (mod == '/') {
				tabris.create('TextView', {
			    	text: '/',
			    	layoutData: {left: 'prev() 0', top: 3, height: buttonh},
			        alignment: 'center',
			        font: 'bold 24px'
				}).appendTo(composite);
				return;
			}
			new tabris.Button({
			  layoutData: {left: 'prev() 0', width: buttonw, top: 0, height: buttonh},
			  text: mod
			}).on('select', function() {
			  cb && cb(+mod);
		  	}).appendTo(composite);
		});

	return composite;
}

function create() {
	var odds = Fire.defaultOdds;
	var updateResults = function() {
		var dice = diceView.dice();
		var fireDice = dice[0]*10 + dice[1];
		var lossdie = dice[2];
		var durationdie1 = dice[3];
		var durationdie2 = dice[4];
		var results = Fire.resolve(odds, fireDice, combat.getIncr());
		var lloss = LeaderLoss.resolve(fireDice, lossdie, durationdie1, durationdie2);
		if (lloss) {
			results += ', ' + lloss;
		}
		oddsResults.updateResults(results);
	};
	var displayOdds = function() {
		oddsResults.setOdds(odds);
	}
	var calcOdds = function() {
		odds = Fire.calculate(combat.getAttack(),  combat.getDefend(), combat.getCannister());
		displayOdds();
	}

	var composite = tabris.create('Composite', {
    	layoutData: {left: 0, top: 10, right: 0},
        highlightOnTouch: true
	});

		var combat = createFire({left: 1, top: 0, right: 2}, () => {
			calcOdds();
			updateResults();
		}).appendTo(composite);

		var oddsResults = createOddsResults({left: 10, top: [combat,2], right: 2}, function(v) {
			odds = v;
			updateResults();
		}).appendTo(composite);

		var diceView = Dice.create([
			{num: 1, low: 1, high: 6, diecolor: 'white', dotcolor: 'black'},
			{num: 1, low: 1, high: 6, diecolor: 'red', dotcolor: 'white'},
			{num: 1, low: 1, high: 6, diecolor: 'blue', dotcolor: 'white'},
			{num: 1, low: 1, high: 6, diecolor: 'black', dotcolor: 'white'},
			{num: 1, low: 1, high: 6, diecolor: 'black', dotcolor: 'red'}
		], {centerX: 0, top: [oddsResults, 2]}, function(dice) {
			updateResults();
		}).appendTo(composite);

		var diceMods = createDiceMods({centerX: 0, top: [diceView, 2]}, function(v) {
			var dice = diceView.dice();
			var d = Base6.add(dice[0]*10 + dice[1], v);
			diceView.setDie(1, Math.floor(d / 10));
			diceView.setDie(2, d % 10);
			updateResults();
		}).appendTo(composite);

	return composite;
}

module.exports = {
	create: function(battle) {
    	log.debug('Creating Fire for ' + battle.name);
    	return create();
    }
};
