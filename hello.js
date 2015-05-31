
var ui = {};

function init() {
	ui.page = tabris.create("Page", {
	  title: "Hello, World!",
	  topLevel: true
	});

	ui.button = tabris.create("Button", {
	  text: "Native Widgets",
	  layoutData: {centerX: 0, top: 100}
	}).appendTo(ui.page);

	ui.label = tabris.create("TextView", {
	  font: "24px",
	  layoutData: {centerX: 0, top: [ui.button, 50]}
	}).appendTo(ui.page);

	ui.button.on("select", function() {
	  ui.label.set("text", "Totally Rock!");
	});
}

function show() {
	ui.page.open();
}


module.exports = {
	init: init,
    show: show
};