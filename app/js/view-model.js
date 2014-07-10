define([
    'backbone',
    'collections/polls'
], function (
    Backbone,
    PollsCollection
) {
    return Backbone.Model.extend({
    	defaults: {
    		polls: new PollsCollection()
    	},

    	initialize: function () {
    		var promises = {
    			polls: this.get('polls').fetch()
    		};

    		this.set('promises', promises);
    	},

        goToPage: function (name, id) {
            var uri = name + (id ? '/' + id : '');

            this.set('currentPage', {
                name: name,
                id: id
            });
        }
    });
});
        