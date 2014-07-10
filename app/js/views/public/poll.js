define([
    'underscore',
    'views/shared/base',
    'text!templates/public/poll.html'
], function (
    _,
    BaseView,
    PollTemplate
) {
    return BaseView.extend({
    	template: _(PollTemplate).template(),

    	events: {
    		'click button': 'submitVote'
    	},

    	initialize: function () {
    		var that = this;

    		BaseView.prototype.initialize.apply(that, arguments);

    		that.listenTo(that.viewModel, 'change:currentPage', function () {
    			if (that.viewModel.get('currentPage').name === 'poll') {
    				that.render();
    			}
    		});
    	},

    	templateData: function () {
            var deadline = new Date(),
                templateData = BaseView.prototype.templateData.apply(this, arguments);

            deadline.setTime(this.model.get('endDate') * 1000);

            templateData.deadline = deadline.toDateString();

            return templateData;        
        },

    	render: function () {
			var that = this,
				id  = that.viewModel.get('currentPage').id;
			
			$.when(
				// TODO: Remake this function to use endpoint
				// that.model.fetch()
				
			).done(function () {
				that.model = that.viewModel.get('polls').findWhere({
					id: parseInt(id)
				});

				BaseView.prototype.render.apply(that, arguments);	
			});

			return that;
    	},

    	submitVote: function () {
    		//TODO: refactor to actually work. Placeholder atm
    		this.viewModel.goToPage('polls');
    	}
    });
});
        