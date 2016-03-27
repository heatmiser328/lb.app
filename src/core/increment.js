module.exports = function(val, incr, min, max) {
	val += incr;
    if (val < min) {
    	val = min;
    }
    else if (val > max) {
    	val = max;
    }
    return val;
}
