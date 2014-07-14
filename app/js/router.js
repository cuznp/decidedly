define([
    'backbone'
], function (
    Backbone
) {
    return Backbone.Router.extend({
    	routes: {
            '': 'viewPolls',
            'polls': 'viewPolls',
            'poll/:id': 'viewPoll',
            '*notfound': 'viewError'
        },

        initialize: function (options) {
    		var that = this;

    		that.viewModel = options.viewModel;

            that.listenTo(that.viewModel, 'change:currentPage', that.updateUrl);
    	},

    	viewPolls: function () {
    		this.viewModel.goToPage('polls');
    	},

    	viewPoll: function (id) {
    		this.viewModel.goToPage('poll', parseInt(id));
    	},

        viewError: function () {
            this.viewModel.goToPage('error');  
        },

    	updateUrl: function () {
    		var uri,
    			currentPage = this.viewModel.get('currentPage')

            if(currentPage.name === 'error') {
                return;
            }

    		uri = currentPage.name + (currentPage.id ? '/' + currentPage.id : '');

    		this.navigate(uri);
    	}
    });
});