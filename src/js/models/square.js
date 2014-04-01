var Square = Backbone.Model.extend({
	defaults : {
		decay : 0,
		piece : "none"
	},

	initialize : function(options){
		this.on("change:piece", this.changing);
		this.side = options.side;
		this.index = options.index;
	},

	changing : function(){
		// this.changed stores the object with properties for all attributes changed
		if(this.changed.piece != "none"){
			this.set("decay", 7);
		}
	},

	age : function() {
		if(this.get("decay") > 0){
			this.set("decay", this.get("decay") - 1);
		}
		if(this.get("decay") === 0){
			this.set("piece", "none");
		}
		return this;
	}
});
