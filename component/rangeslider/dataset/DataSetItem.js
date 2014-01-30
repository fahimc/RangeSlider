var DataSetItem = function() {
};
(function() {
	var _ = DataSetItem.prototype;
	
	_.width=50;
	_.height=50;
	_.element=null;
	_.label=null;
	_.index="";
	_.data=null;
	_.className="";
	_.labelClassName="label";
	_.build = function(data) {
		this.data=data;
		//build element
		this.element = document.createElement("DIV");
		this.element.setAttribute("data-index",this.index);
		//build label
		this.label = document.createElement("DIV");
		this.label.innerHTML =data.label;
		
		this.element.appendChild(this.label);
		this.setStyle();
	};
	_.getColour = function() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.round(Math.random() * 15)];
		}
		return color;
	};
	_.setStyle=function()
	{
		this.element.className = this.className;
		this.element.style.height = "inherit";
		this.element.style.display = "inline-block";
		this.element.style.overflow = "hidden";
		this.element.style.webkitUserSelect = "none";
		this.element.style.userSelect = "none";
		
		// this.element.style.backgroundColor = this.getColour();
		this.label.className = this.labelClassName;
		// this.label.style.color="#666";
		this.label.style.position="relative";
		this.label.style.width="100%";
		this.label.style.textAlign="center";
	};
	_.state=function(state)
	{
		if(state=="ON")
		{
			this.stateOn();
		}else{
			this.stateOff();
		}
	};
	_.stateOn=function()
	{
		this.label.style.color="#FFF";
	};
	_.stateOff=function()
	{
		this.label.style.color="#666";
	};
	_.arrange=function()
	{
		this.element.style.width = this.width+"px";
		this.label.style.marginTop=-((this.label.clientHeight-this.element.clientHeight) *0.5)+"px";
	};
})();
