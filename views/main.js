var select = require('./select.js');

module.exports = {
	run: function() {
    	var page = tabris.create("Page", {
        	title: "La Bataille Assistant",
            image: "images/lb.png",
			topLevel: true
		});
        tabris.create("TextView", {
        	text: "Welcome to the La Bataille Assistant!",
        	font: "24px",
            layoutData: {left: 15, top: 20}
            
		}).appendTo(page);
        
		select.init();
        page.open();
    }
};
