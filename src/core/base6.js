var _ = require('lodash');

var values = [];

function init() {
    for (var i=1; i<=6; i++) {
        for (var j=1; j<=6; j++) {
            values.push(i*10 + j);
        }
    }
}

function op(lhs, rhs, add) {
    var index = _.findIndex(values, (v) => {
        return v == lhs;
    });
    if (index >= 0) {
        if (add) {
            index += rhs;
        }
        else {
            index -= rhs;
        }
        if (index < 0) {
            index = 0;
        }
        else if (index >= values.length) {
            index = values.length - 1;
        }
        return values[index];
    }
    return lhs;
}

init();

module.exports = {
    add(l,r) {
        return op(l,r,true);
    },
    subtract(l,r) {
        return op(l,r,false);
    }
};
