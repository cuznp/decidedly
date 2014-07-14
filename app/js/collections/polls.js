define([
    'backbone',
    'models/poll'
], function (
    Backbone,
    PollModel
) {
    return Backbone.Collection.extend({
    	url: 'api-polls.php',

    	model: PollModel
    });
});