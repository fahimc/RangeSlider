var RangeSlide = function(){};
(function()
{
	var _ = RangeSlide.prototype;
	
	
	_.element = null;
	_.leftButton = null;
	_.rightButton = null;
	_.middleHolder = null;
	_.dataSet = null;
	_.slider = null;
	_.buttonWidth = 31;
	_.buttonHeight=31;
	_.itemWidth=100;
	_.callback=null;
	_.DataSetItem = DataSetItem ? DataSetItem : null;
	_.classNames=
	{
		element:"RangeSlider",
		middleHolder:"RangeSliderMiddle",
		leftButton:"RangeSliderLeftButton",
		rightButton:"RangeSliderRightButton"
	};
	_.handlers=[];
	_.data=[];
	_.build=function()
	{
		var root=this;
		//build holder
		this.element = document.createElement("DIV");
		//build middle
		this.middleHolder = document.createElement("DIV");
		//build left button
		this.leftButton = document.createElement("DIV");		
		//build right button
		this.rightButton = document.createElement("DIV");
		//build DataSet
		this.dataSet = new DataSet();
		this.dataSet.DataSetItem=this.DataSetItem;
		this.dataSet.itemWidth=this.itemWidth;
		this.dataSet.callback=function(collection){root.send(collection);};
		//build slider
		this.slider = new Slider();
		this.slider.height=this.buttonHeight;
		this.slider.build();
		this.slider.callback=function(data){root.checkRange(data);};
		this.dataSet.margin = this.slider.buttonWidth;
		this.dataSet.build(this.data);
		//add children
		this.element.appendChild(this.leftButton);
		this.element.appendChild(this.middleHolder);
		this.element.appendChild(this.rightButton);
		this.middleHolder.appendChild(this.dataSet.element);
		this.middleHolder.appendChild(this.slider.element);
		
		this.addClassNames();
		this.setStyle();
		this.setListeners();
		
		//update data items
		this.dataSet.currentData={x:0,buttonWidth:this.slider.buttonWidth,width:this.slider.minWidth};
		
	};
	_.setListeners=function()
	{
		var root=this;
		window.addEventListener("resize",function(){root.resize()});
		this.leftButton.addEventListener("click",this.getHandler("onButtonClicked"));
		this.rightButton.addEventListener("click",this.getHandler("onButtonClicked"));
	}
	_.addClassNames=function()
	{
		for(var name in this.classNames)
		{
			this[name].className = this.classNames[name];
		}
	}
	_.setStyle=function()
	{
		this.element.style.position="absolute";
		this.element.style.width="100%";
		this.element.style.webkitUserSelect = "none";
		this.element.style.userSelect = "none";
		//set left button style
		this.leftButton.style.display="inline-block";
		this.leftButton.style.width=this.buttonWidth+"px";
		this.leftButton.style.height=this.buttonHeight+"px";
		//set middle style		
		this.middleHolder.style.position="relative";
		this.middleHolder.style.overflow="hidden";
		this.middleHolder.style.display="inline-block";
		this.middleHolder.style.height=this.buttonHeight+"px";
		//set right button style		
		this.rightButton.style.display="inline-block";
		this.rightButton.style.width=this.buttonWidth+"px";
		this.rightButton.style.height=this.buttonHeight+"px";
	};
	_.checkRange=function(data)
	{
		this.dataSet.check(data);
		
	};
	_.send=function(collection)
	{
		if(this.callback)this.callback(collection);
	}
	_.arrange=function()
	{
		//set the width of the middle holder
		this.middleHolder.style.width = (this.element.clientWidth -(this.buttonWidth * 2))+"px";
		//call datasets arrange method
		this.dataSet.arrange();
		//arrange slider
		this.slider.height=this.buttonHeight;
		this.slider.minWidth = this.dataSet.currentWidth;
		this.slider.arrange();
	};
	_.resize=function()
	{
		this.arrange();
	};
	_.onButtonClicked=function(event)
	{
		var target = event.srcElement || event.target;
		var direction="";
		switch(target)
		{
			case this.leftButton:
			direction="LEFT";
			break;
			case this.rightButton:
			direction="RIGHT";
			break;
		}
		this.dataSet.move(direction);
	};
	_.getHandler=function(funcName)
	{
		var root=this;
		if(!this.handlers[funcName])this.handlers[funcName]=function(event)
		{
			root[funcName](event);
			event.preventDefault();
			event.stopPropagation();
		};
		return this.handlers[funcName];
	};
	_.height=function(value)
	{
		if(value && this.element)
		{
			this.element.style.height=value+"px";
		}
		return this.element.style.height.replace("px","");
	}
})();
