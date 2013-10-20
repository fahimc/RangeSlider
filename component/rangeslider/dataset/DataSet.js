var DataSet = function() {
};
(function() {
	var _ = DataSet.prototype;

	_.data = null;
	_.element = null;
	_.itemsHolder = null;
	_.itemWidth = 50;
	_.itemCollection = [];
	_.currentWidth = 0;
	_.classNames = {
		item : "item"
	};
	_.currentX = 0;
	_.DataSetItem =  null;
	_.currentData=null;
	_.margin = 0;
	_.build = function(data) {
		this.data = data;
		//build holder
		this.element = document.createElement("DIV");
		//build items holder
		this.itemsHolder = document.createElement("DIV");

		//add children
		this.element.appendChild(this.itemsHolder);
		this.setStyle();
		this.setListeners();
	};
	_.setListeners=function()
	{
		var root=this;
		this.itemsHolder.addEventListener( 'webkitTransitionEnd',  function( event ) { root.check();}, false );
	};
	_.update = function() {
		if (!this.data.length)
			return;
		this.itemsHolder.innerHTML = null;
		this.itemCollection=[];
		//calculate the width
		this.currentWidth = this.getItemWidth();
		for (var a = 0; a < this.data.length; a++) {
			this.buildItem(this.data[a], this.currentWidth, a);
		}
		this.itemsHolder.style.width = this.data.length * (this.currentWidth+(this.margin *2)) + "px";
		this.check();
	}
	_.getItemWidth = function() {
		var width = this.itemWidth;
		var isLess = (this.itemWidth * this.data.length) < this.element.clientWidth;
		//if item holder width less than holder width
		if (isLess)
			//divide the space between the items
			width = this.element.clientWidth / this.data.length;
		return width;
	}
	_.buildItem = function(data, width, index) {
		var item = new DataSetItem();
		item.className = this.classNames.item;
		item.width = width+(this.margin *2);
		item.index = index;
		item.build(data);
		this.itemsHolder.appendChild(item.element);
		item.arrange();
		this.itemCollection.push(item);
	}
	_.setStyle = function() {
		this.element.style.position = "relative";
		this.itemsHolder.style.position = "absolute";
		this.element.style.overflow = "hidden";
	};
	_.move = function(direction) {
		var movement = 0;
		this.itemsHolder.style.webkitTransitionDuration = "0.3s";
		this.itemsHolder.style.webkitTransitionTimingFunction = "ease-out";

		switch(direction) {
			case "LEFT":
				movement = this.itemWidth+(this.margin * 2);
				break;
			case "RIGHT":
				movement = -(this.itemWidth+(this.margin * 2));
				break;
		}
		var x = this.currentX + movement;
		//check if left boundary
		if (x > 0)
			x = 0;
		//check right boundary
		var dif = (this.element.clientWidth) - (this.itemsHolder.clientWidth);
		if (x < dif)
			x = dif;
		this.currentX = x;
		//animate
		this.itemsHolder.style.webkitTransform = "translate(" + x + "px, 0)";
		
	}
	_.getX = function() {
		return Number(this.itemsHolder.style.left.replace("px", ""));
	}
	_.check = function(data) {
		data=data?data:this.currentData;
		//work out the holder x
		
		var x =   (data.x)-this.currentX;
		
		var collection=[];
				
		for (var a = 0; a < this.itemCollection.length; a++) {
			var child = this.itemCollection[a];
			var childX = (a * (this.currentWidth+(this.margin * 2)));
			//if(a==0)console.log(a,childX,this.itemWidth,data.x,data.width);
			if (childX+this.currentWidth >= x && childX+this.currentWidth <= x+data.width ||childX >=x && childX <= x+data.width) {
				//console.log(a,childX,this.itemWidth,data.x,data.width);
				child.state("ON");
				collection.push(child.data);
			} else {
				child.state("OFF");
			}
		}
		this.currentData = data;
		if(this.callback)this.callback( collection);
	};
	_.arrange = function() {
		this.itemsHolder.style.height = this.element.parentNode.clientHeight + "px";
		this.element.style.width = this.element.parentNode.clientWidth + "px";
		this.element.style.height = this.element.parentNode.clientHeight + "px";
		//build items
		this.update();
		this.arrangeItemHolder();
	};
	_.arrangeItemHolder = function() {
		var x = this.currentX;
		//check if left boundary
		if (x >= this.margin)
			x = this.margin;
		//check right boundary
		var dif = this.element.clientWidth - this.itemsHolder.clientWidth;
		if (x <= dif)
			x = dif;
		this.currentX = x;
		//animate
		this.itemsHolder.style.webkitTransform = "translate(" + x + "px, 0)";
	};
	_.arrangeItems = function() {
		for (var a = 0; a < this.itemCollection.length; a++) {
			var child = this.itemCollection[a];
			child.arrange();
		}
	}
})();
