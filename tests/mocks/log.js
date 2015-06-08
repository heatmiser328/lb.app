var sinon = require('sinon');

function log() {
	var args = Array.prototype.slice.call(arguments, 0);
	console.log(args.join(' '));
}

module.exports = function(output) {
	var logger = {
    	debug: log,
        info: log,
        warn: log,
        error: log,
        fatal: log
	};
    var stub = {
    	debug: sinon.stub(),
        info: sinon.stub(),
		warn: sinon.stub(),
		error: sinon.stub(),
		fatal: sinon.stub()
	};                
    
	return output ? logger : stub;
};
