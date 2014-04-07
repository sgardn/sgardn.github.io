var List = Backbone.Model.extend({
	
	defaults : {
		text : "empty...",
		children : [],
		parent : undefined
	},

	initialize : function(obj) {
		//  attributes that are on obj become part of our DM
		if(obj !== undefined){
			// we need to conditionalize this by whether our children are already 
			// items or not, in which case if we try to "new" them again, BAD
			var cs = [];
			if(obj.children !== undefined){
				_.each(obj.children, function(a){
					cs.push(new List(a));
				});
			} 
			if(cs.length !== 0){
				this.set({children:cs});
			} 
		} else {
			console.log("CANNOT CREATE, obj is undefined");
		}
	},

	print : function(acc){
		if((typeof acc) == "undefined"){
			console.log("top level print...");
			acc = "";
		}
		console.log(acc + this.get("text"));		
		_.each(this.get("children"), function(c){
			c.print(" - "+acc);
		});
	}
});