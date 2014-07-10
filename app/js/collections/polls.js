define([
    'backbone',
    'models/poll'
], function (
    Backbone,
    PollModel
) {
    return Backbone.Collection.extend({
    	url: 'json/polls.json',

    	model: PollModel
    });
});