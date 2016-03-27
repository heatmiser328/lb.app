var select = require('./select.js');
var Battle = require('./battle.js');

module.exports = {
	run: function() {
    	var page = new tabris.Page({
        	title: 'La Bataille Assistant',
            //image: 'images/lb.png',
            topLevel: true
		});
		/*
        tabris.create('TextView', {
        	text: 'Welcome to the La Bataille Assistant!',
        	font: '24px',
            layoutData: {left: 15, top: 20}

		}).appendTo(page);
        */
		new tabris.ImageView({
			image: 'images/napolean.jpg',
			scaleMode: 'fill',
			layoutData: {left: 0, right: 0, top: 0, bottom: 0}
		}).appendTo(page);

		select.init();
        page.open();

        //Battle.show(2);
		Battle.show(912);
    }
};
