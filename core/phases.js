var phases = [
	"Command",
	"Imperial: Charge a Cheval",
	"Imperial: Movement",
	"Imperial: Defensive Fire",
	"Imperial: Offensive Fire",
	"Imperial: Melee Assault",
	"Imperial: Rally",
	"Imperial: Rout",
	"Imperial: Readiness Recovery",
	"Sovereign: Charge a Cheval",
	"Sovereign: Movement",
	"Sovereign: Defensive Fire",
	"Sovereign: Offensive Fire",
	"Sovereign: Melee Assault",
	"Sovereign: Rally",
	"Sovereign: Rout",
	"Sovereign: Readiness Recovery"
];

module.exports = {
	count: phases.length,
	all: function() {
    	return phases;
    },
    get: function(idx) {
    	if (idx > -1 && idx < phases.length) {
        	return phases[idx];
        }
    }
};