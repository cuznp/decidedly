define([
    'backbone',
    'models/poll'
], function (
    Backbone,
    PollModel
) {
    return Backbone.Collection.extend({
    	url: function () {
    		return 'api-polls.php?ip=' + window.connectionIp;
    	},

    	model: PollModel
    });
});