define([
    'backbone'
], function (
    Backbone
) {
    return Backbone.Router.extend({
    	initialize: function (options) {
    		var that = this;

    		that.viewModel = options.viewModel;

    		this.route(/^$/, 'polls', that.viewPolls);
    		that.route(/^polls$/, 'polls', that.viewPolls);
            that.route(/^poll\/(([0-9])+)+$/, 'poll', that.viewPoll);

            that.listenTo(that.viewModel, 'change:currentPage', that.updateUrl);
    	},

    	viewPolls: function () {
    		this.viewModel.goToPage('polls');
    	},

    	viewPoll: function (id) {
    		this.viewModel.goToPage('poll', id);
    	},

    	updateUrl: function () {
    		var uri,
    			currentPage = this.viewModel.get('currentPage'),
    			id = '';

    		if(currentPage.id) {
    			id = currentPage.id;
    		}

    		uri = currentPage.name + (id ? '/' + id : '');

    		this.navigate(uri);
    	}
    });
});