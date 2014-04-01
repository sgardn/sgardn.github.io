var SquareView = Backbone.View.extend({
	
	events : {
		"click": "click",
	},

	template : 
		"<div class ='<%= classes %>'>"+
		"<span class='piece'><%= piece === 'none' ? '' : piece  %> <%= decay === 0 ? '' : decay  %></span>"+
		"</div>",

	initialize : function(model, options){
		this.model = model;
		this.parent = options.parent;
		this.classes = this.genClasses();
	},

	click : function(e){
		e.stopPropagation();
		if(this.model.get("piece") === "none"){
			this.model.set("piece", this.parent.whoseMove);
			this.trigger('newPiece', this.model.get("index"));
		} else {
			console.log("click somewhere else...");
		}
	},

	render : function(){
		var tmp = _.extend(this.model.toJSON(), {classes : this.classes});
		var template = _.template(this.template);
		this.setElement(template(tmp), true); // true flag will delegate events
		return this;
	},

	genClasses : function(){
		var i = this.model.get("index");
		var side = this.model.get("side");
		var row = Math.floor(i / side);
		var column = i % side;
		var classes = "block";
		if(row === 0) {
			classes += " top";
		} else if( row === side - 1){
			classes += " bottom";
		} else {
			classes += " middle";
		}
		if(column === 0){
			classes += " left";
		} else if (column === side - 1){
			classes += " right";
		} else {
			classes += " center";
		}
		return classes;
	}

});