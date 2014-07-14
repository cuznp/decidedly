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
    		var poll,
                that = this;

    		BaseView.prototype.initialize.apply(that, arguments);

    		that.listenTo(that.viewModel, 'change:currentPage', that.handleChangeOfModel);
    	},

    	templateData: function () {
            var deadline = new Date(),
                templateData = BaseView.prototype.templateData.apply(this, arguments);

            deadline.setTime(this.model.get('endDate') * 1000);

            templateData.deadline = deadline.toDateString();

            return templateData;        
        },

        handleChangeOfModel: function () {
            var that = this,
                currentPage = that.viewModel.get('currentPage');

            if (currentPage.name === 'poll') {
                poll = that.viewModel.get('polls').findWhere({
                    id: currentPage.id
                });

                if (poll) {
                    that.model = poll;

                    $.when(
                        that.model.fetch()
                    ).done(function () {
                        that.render(); 
                    });    
                }
            }
        },

    	submitVote: function () {
    		//TODO: refactor to actually work. Placeholder atm
    		this.viewModel.goToPage('polls');
    	}
    });
});
        