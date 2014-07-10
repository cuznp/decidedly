define([
	'underscore',
    'views/shared/base',
    'text!templates/public/polls.html'
], function (
    _,
    BaseView,
    PollsTemplate
) {
    return BaseView.extend({
    	template: _(PollsTemplate).template(),

    	events: {
    		'click .polls li': 'viewPoll'
    	},

    	initialize: function () {
    		var that = this;

    		BaseView.prototype.initialize.apply(that, arguments);

    		that.listenTo(that.collection, 'add remove', that.render);
    	},

        templateData: function () {
            var deadline,
                templateData = BaseView.prototype.templateData.apply(this, arguments);

            templateData.polls = [];

            this.collection.each(function (poll) {
                deadline = new Date();
                deadline.setTime(poll.get('endDate') * 1000);

                templateData.polls.push({
                    id: poll.get('id'),
                    title: poll.get('title'),
                    avatar: poll.get('user').avatar,
                    username: poll.get('user').username,
                    deadline: deadline.toDateString()
                });
            });    
            
            return templateData;        
        },

    	viewPoll: function (event) {
    		var id = $(event.target.parentElement).attr('id');

    		this.viewModel.goToPage('poll', id);
    	}
    });
});
        