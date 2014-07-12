define([
    'module',
    'backbone',
    'collections/polls'
], function (
    module,
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

            this.set('connectionIp', module.config().connectionIp);
    	},

        goToPage: function (name, id) {
            this.set('currentPage', {
                name: name,
                id: id
            });
        }
    });
});
        