
var ListView = Backbone.View.extend({
	tagName : "li",
	model : this.model,
	events : {
		"click": "showHide",
		"mouseover" : "over",
		"mouseout" : "out",
	},

	initialize : function(obj, dest, parent) {
		// store all our child views in here, references...
		this.childViews = [];
		this.focused = false;
		this.parent = parent;
		obj = obj || {};
		
		if(dest){
			// this.setElement(dest.slice(0,1)[0]);
			this.elle = dest.slice(0,1)[0];
			this.dest = dest.slice(1,2)[0];
			this.tempDest = this.dest+"-temp";
			this.nextDest = dest.slice(1);
		} else {
			throw "No destination for rendering...";
		}
		if(obj.model !== undefined){
			this.model = obj.model;
		} else {
			this.model = new List(obj);  // obj === {}
		}
		
		_.bindAll(this, "render");
		this.model.bind('change', this.render);

		_.each(this.model.get("children"), function(c){
			var n = new ListView({model:c}, this.nextDest, this);
			this.childViews.push(n);	
		}, this);
		
		var _template = "<span class='meta-title d'><%= text %> </span>";
				_template += "<% if (children && children.length) { %> ";
				_template += "<i id='show' class='fa fa-chevron-right d'/>";           
				_template += "<% } %>";
		this.template = _.template(_template);
	},

	over : function(e){
		e.stopPropagation();
		e.stopImmediatePropagation();
		if(!this.focused){
			// console.log("over...");
			this.tempShow(e);
		}
		
	},

	out : function(e){
		e.stopPropagation();
		e.stopImmediatePropagation();
		if(!this.focused){
			// console.log("and out!");
			this.tempHide(e);
		}
		
	},

	tempHide : function(e){
		// this.showHide(e);
		$(this.tempDest).html("");
		
		
		// if(!this.focused){
		// console.log("let's temporarily HIDE...");
		// } else {
		//	// do nothing
		// }
	},

	tempShow : function(e){
		// this.showHide(e);
		// console.log(this.tempDest);
		if(!this.focused){
			// console.log("let's temporarily SHOW...");
			$(this.tempDest).fadeIn(500);
			_.each(this.model.get("children"), function(m){
				$(this.tempDest).append("<li>"+m.get("text")+"</li>");
			}, this);
			// console.log(this.)
		} else {
			// do nothing
		}
	},

	showHide : function(e) {
		e.stopPropagation();
		e.stopImmediatePropagation();
		// debugger;
		// have to save current state, as unfocusChildren will set it to false
		var save = this.focused;
		if(!this.focused) { 
			// WE CLICKED SOMETHING THAT IS ABOUT TO BE SHOWN
			// only unfocusChildren if we're setting focused => true
			// otherwise we'll take care of it with removeFocus
			// since only one child can have focus per list
			if(this.parent){
				this.parent.unfocusChildren();
			}
			// switch current state
			this.focused = !save;
			this.renderChildren();
			this.addFocus();
			this.tempHide();
		} else {
			// WE CLICKED SOMETHING THAT IS ABOUT TO BE HIDDEN
			this.removeFocus();
			this.hide();
			this.tempShow();
		}
	},

	unfocusChildren: function(){
		_.each(this.childViews, function(c){
			c.removeFocus();
		});
	},

	addFocus: function(){
		this.$el.children().addClass("focus");
		this.$el.children(".fa-chevron-right").addClass("spin");
	},

	removeFocus: function(){
		// this is called from the parent to unfocus all children, let it change the focused state
		this.$el.children().removeClass("focus");
		this.$el.children(".fa-chevron-right").removeClass("spin");
		this.focused = false;
	},

	hide : function(){
		this.focused = false;
		$(this.dest).hide();
		_.each(this.childViews, function(n){
			n.hide(); 
		});
		// this.remove();
	},

    renderChildren : function(){
		$(this.dest).empty().show();
		// TODO
		// clears out whatever might be there otherwise
		// should actually trigger "go remove all other views from siblings"
		if(this.focused){
			if(this.model.get("children").length !== 0 ){
				// console.log(this.model.get("text")+ " => RENDERING => "+this.dest);
				_.each(this.childViews, function(n){
					$(this.dest).append(n.render().el);
				}, this);
			} 
		} else {
			throw "renderChildren being called while not focused";
		}	
    },

	render : function() {
		this.delegateEvents();
		// have to make sure events are listened to
		// may have used .empty() if it's not our first render
		this.$el.html(this.template(this.model.toJSON()));
		$(this.elle).append(this.el);
		if(this.focused){
			this.renderChildren();
		}
		return this;
	}

});