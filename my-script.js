$(function(){

	//override backbone SYNC
	Backbone.sync = function(method, model, success, error){
    success();
  }

	
	var Item = Backbone.Model.extend({
		defaults :{
			part1: 'stuff',
			part2: '30'
		}
	});

	var Itemview = Backbone.View.extend({
		tagName: 'li',

		//respond to some events
		events: {
			'click span.swap': 'swap',
			'click span.delete': 'remove'
		},

		initialize:function(){
			_.bindAll(this,'render','unrender','swap','remove');
			this.template = _.template($('#Item-view').html())
			
			this.model.bind('change', this.render)
			this.model.bind('remove', this.unrender)
		
		},
		unrender:function(){
			$(this.el).remove()
		},

		render:function(){
			$(this.el).html(this.template(this.model.toJSON()))
			return this
		},
		swap:function(){
			console.log('SWAPPP')
		
		//swap part1 and part2 of the model
		var swapped = {
			part1: this.model.get('part2'),
			part2: this.model.get('part1')
		};
		//this will trigger a 'change' event.
		this.model.set(swapped);
		},
		
		//totally remove this model, not just from DOM, everything
		remove:function(){
			this.model.destroy()
			//this will trip the unrender function which removes from DOM.
		}
	})

	var List = Backbone.Collection.extend({
		model: Item
	});

	//this view only cares about listening to the collection
	var ListView = Backbone.View.extend({

		//inject right into Body element
		el: $('body'),

		//what to trigger when we click the button
		events: {
			'click button#add' : 'addItem',
			'click button#clear' : 'clear'
		},

		/*Kinda weird, but how it works:
		 * AddItem adds a single model record. this model is added to the collection.
		 * we listen for when the collection changes and then render this new item with ItemView.
		 * This view is then rendered.
		 * this is faster than having the collection re-render itself for adding just a single item
		 * could be function on collection to re-order and re-render itself if need-be.
		*/

		initialize: function(){
			//bind all actions we do to 'this' (excluding UI events)
			_.bindAll(this,'render','addItem','appendItem','clear')

			//when the collection has new element added, update the view
			this.collection = new List()
			this.collection.bind('add', this.appendItem)

			this.counter = 0; //total number of items so far
			this.template = _.template($('#List-view').html())
			this.render();
		},

		render: function(){
			$(this.el).append(this.template({}))
			
			//in case collection is not empty
			_(this.collection.models).each(function(item){
				appendItem(item);
			}, this)
		},

		appendItem:function(item){
			var itemView = new Itemview({model:item})

			//context , selector
			$('ul',this.el).append(itemView.render().el);
			//itemView.delegateEvents()
		},

		addItem:function(){
			
			//add the item to the collection
			this.counter++
			var thing = new Item()
			val = this.counter
			thing.set({part2:val})
			this.collection.add(thing)
		},

		clear: function(){
			$('ul').empty()
			this.counter = 0
		}

	})

	var theApp = new ListView()

})
