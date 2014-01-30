var Slider = function() {
};
(function() {
	var _ = Slider.prototype;

	_.element = null;
	_.leftButton = null;
	_.rightButton = null;
	_.middle = null;
	_.minWidth = 50;
	_.height = 0;
	_.buttonWidth = 31;
	_.opacity = 0.5;
	_.handlers = [];
	_.x = 0;
	_.currentChild = null;
	_.startX = 0;
	_.callback = null;
	_.classNames = {
		element : "RangeSliderHandleHolder",
		middle : "RangeSliderHandleMiddle",
		leftButton : "RangeSliderHandleLeftButton",
		rightButton : "RangeSliderHandleRightButton"
	};
	_.build = function() {
		this.element = document.createElement("DIV");
		//build left button

		this.leftButton = document.createElement("DIV");
		//build middle
		this.middle = document.createElement("DIV");
		//build right button
		this.rightButton = document.createElement("DIV");

		//add children
		this.element.appendChild(this.leftButton);
		this.element.appendChild(this.middle);
		this.element.appendChild(this.rightButton);

		this.addClassNames();
		this.setStyle();
		this.setListeners();

	};
	_.addClassNames = function() {
		for (var name in this.classNames) {
			this[name].className = this.classNames[name];
		}
	}
	_.setListeners = function() {
		this.middle.addEventListener("mousedown", this.getHandler("onMouseDown", this.middle));
		this.rightButton.addEventListener("mousedown", this.getHandler("onMouseDown", this.rightButton));
		this.leftButton.addEventListener("mousedown", this.getHandler("onMouseDown", this.leftButton));
	};
	_.setStyle = function() {
		this.element.style.position = "absolute";
		this.element.style.top = "0";

		this.leftButton.style.display = "inline-block";
		this.leftButton.style.width = this.buttonWidth + "px";
		this.leftButton.style.height = "inherit";

		this.middle.style.display = "inline-block";
		this.middle.style.height = "inherit";
		this.middle.style.opacity = this.opacity;
		this.rightButton.style.display = "inline-block";
		this.rightButton.style.width = this.buttonWidth + "px";
		this.rightButton.style.height = "inherit";

		//debug
		// this.leftButton.style.backgroundColor = "#999";
		// this.middle.style.backgroundColor = "#f00";
		// this.rightButton.style.backgroundColor = "#999";

	};
	_.arrange = function() {
		this.middle.style.minWidth = this.minWidth + "px";
		this.element.style.height = this.height + "px";
		this.setX();
		this.checkWidth();
	};
	_.checkWidth = function() {
		var w = (this.buttonWidth * 2) + this.middle.clientWidth;
		if (w > this.element.parentNode.clientWidth) {
			w = this.element.parentNode.clientWidth - (this.buttonWidth * 2);
			this.middle.style.width = w + "px";
		}
	};
	_.getHandler = function(funcName, target) {
		var root = this;
		var t = target;
		if (!this.handlers[funcName])
			this.handlers[funcName] = function(event) {
				event.target = t;
				root[funcName](event);
			};
		return this.handlers[funcName];
	};
	_.onMouseDown = function(event) {
		this.currentChild = event.target;
		this.startX = this.mouseX(this.currentChild, event);

		window.addEventListener("mouseup", this.getHandler("onMouseUp"));
		window.addEventListener("mousemove", this.getHandler("onMouseMove"));

		event.preventDefault();
		event.stopPropagation();
	};
	_.onMouseUp = function(event) {
		window.removeEventListener("mouseup", this.getHandler("onMouseUp"));
		window.removeEventListener("mousemove", this.getHandler("onMouseMove"));
		this.currentChild = null;
	};
	_.onMouseMove = function(event) {
		switch(this.currentChild) {
			case this.middle:
				this.middleMouseMove(event);
				break;
			case this.rightButton:
				this.rightMouseMove(event);
				break;
			case this.leftButton:
				this.leftMouseMove(event);
				break;
		}

		this.sendData();
		event.preventDefault();
		event.stopPropagation();
	};
	_.sendData = function() {
		//send data back
		var data = {
			x : this.x,
			buttonWidth : this.buttonWidth,
			width : this.middle.clientWidth
		};
		if (this.callback)
			this.callback(data);
	};
	_.middleMouseMove = function(event) {
		var x = (this.mouseX(this.middle, event) - this.buttonWidth);
		var movement = x - this.startX;
		this.x += movement;
		this.setX();
		this.startX = this.x;
	};
	_.rightMouseMove = function(event) {
		var x = this.mouseX(this.currentChild, event);
		var movement = x - this.startX;
		var w = (this.middle.clientWidth + movement);
		//ensure width is not greater than parent width
		if (this.x + (this.buttonWidth * 2) + w > this.element.parentNode.clientWidth)
			w = this.element.parentNode.clientWidth - (this.x + (this.buttonWidth * 2) + w);

		this.middle.style.width = w + "px";

	};
	_.leftMouseMove = function(event) {
		var x = this.mouseX(this.currentChild, event);
		var movement = this.startX - x;
		//move back
		this.x -= movement;
		var w = (this.middle.clientWidth + movement);
		//ensure x os not less than 0;
		if (this.x < 0) {
			var diff = Math.abs(this.x);
			this.x = 0;
			w -= diff;

		}
		// if w is min
		if (w <= this.minWidth) {
			var diff = this.minWidth - w;
			w = this.minWidth;
			this.x -= diff;

		}
		this.element.style.left = this.x + "px";
		this.middle.style.width = w + "px";
		this.startX = this.x;

	};
	_.setX = function() {

		var w = (this.buttonWidth * 2) + this.middle.clientWidth;
		//ensure x is not less than 0
		if (this.x <= 0)
			this.x = 0;
		//ensure x is less than max width
		if (this.x + w >= this.element.parentNode.clientWidth)
			this.x = this.element.parentNode.clientWidth - w;
		//move slider
		this.element.style.left = (this.x ) + "px";
	}; 
	_.getOffset=function(obj) {
			var curleft = 0, curtop = 0;

			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while (obj = obj.offsetParent);

				return {
					x : curleft,
					y : curtop
				};
			}
	};
	//get mouse x position
	_.mouseX = function(elem, e) {
		var x;
		if (e.pageX) {
			x = e.pageX;
		} else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;

		}
		x -= elem.offsetLeft;
		x=x-this.getOffset(this.element.parentNode).x;
		return x;
	};
})();
