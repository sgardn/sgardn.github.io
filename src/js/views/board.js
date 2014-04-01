var Board = Backbone.View.extend({

    el: $('#board'),

    template: "<div class='block top left'/><div class='block top mid'/><div class='block top right'/>" + "<div class='block center left'/><div class='block center mid'/><div class='block center right'/>" + "<div class='block bottom left'/><div class='block bottom mid'/><div class='block bottom right'/>",

    initialize: function(options) {
        console.log("initializing our Board View");
        this.collection = new Grid();
        this.gameOver = false;
        this.children = [];
        var temp;
        for (var i = 0; i < options.sideLength; i++) {
            for (var j = 0; j < options.sideLength; j++){
                temp = new Square({side: options.sideLength, index : i*options.sideLength + j});
                this.collection.add(temp);
                this.children.push(new SquareView(temp, {parent: this}));
            }
        }
        console.log(this.collection);
        this.whoseMove = "X";
        this.showMove();
        _.each(this.children, (function (c){
            this.listenTo(c, 'newPiece', this.newPiece);
        }), this);        
    },

    newPiece : function(i) {
        if(!this.gameOver){
            this.render(i);
            this.checkWin(i, this.whoseMove);
            this.changeMove();
        }
    },

    showMove: function() {
        if(!this.gameOver){
            $("#status").html("<h1>It's " + this.whoseMove + "'s turn to play</h1>");    
        }
        
    },

    changeMove: function() {
        if (this.whoseMove == "X") {
            this.whoseMove = "O";
        } else {
            this.whoseMove = "X";
        }
        this.showMove();
    },

    render: function(i) {

        // TODO -- change render so it doesn't rerender all child views, only those with models?
        // investigate more efficient re rendering...

        this.collection.each(function(c){
            c.age();
        });
        var that = this;
        this.$el.empty();
        _.each(this.children, (function(c){
            that.$el.append(c.render().el);
        }));
    },

    checkWin: function(i, p) {
        var w = this.checkRow(i, p) || this.checkColumn(i, p) || this.checkDiagonal(i, p);
        if (w) {
            this.gameOver = true;
            $("#status").html("<h1> " + p + " has won!</h1>");
        }
    },

    checkRow: function(index, p) {
        var row = Math.floor(index / 3);
        var ans = true;
        var checker;
        for (var j = 0; j < 3; j++) {
            checker = (row * 3) + j;
            ans = ans && (this.collection.at(checker).get("piece") === p);
        }
        return ans;
    },

    checkColumn: function(index, p) {
        var column = index % 3;
        var ans = true;
        var checker;
        for (var i = 0; i < 3; i++) {
            checker = column + (i * 3);
            ans = ans && (this.collection.at(checker).get("piece") === p);
        }
        return ans;
    },

    checkDiagonal: function(i, p) {
        if(typeof i !== "number") throw "badly formed arg for check diag";
        if (i === 0 || i === 4 || i === 8) {
            if (   (this.collection.at(0).get("piece") === p)
                && (this.collection.at(4).get("piece") === p)
                && (this.collection.at(8).get("piece") === p) ) {
                    return true;
            }
        }
        if (i === 2 || i === 4 || i === 6) {
            if (   (this.collection.at(2).get("piece") === p)
                && (this.collection.at(4).get("piece") === p)
                && (this.collection.at(6).get("piece") === p) ) {
                    return true;
            }
        }
        return false;
    }
});
