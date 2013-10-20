function init() {
	var slider = new RangeSlide();
	slider.data = [{
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}, {
		label : "10 SEP",
		value : 123456
	}];
	slider.callback = range;
	slider.build();
	slider.height(31);
	document.body.appendChild(slider.element);
	slider.arrange();

}

function range(collection) {
	//	console.log("collection",collection);
}
