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
            'click li': 'chooseOption',
    		'click .cast-vote': 'castVote',
            'click .back': 'backToPolls'
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

        render: function () {
            BaseView.prototype.render.apply(this, arguments);

            this.updatePrimaryButton();

            if (this.model.get('results').length) {
                this.renderResults();
            }

            return this;
        },

        renderResults: function () {
            // TODO: Implement rendering of results
        },

        handleChangeOfModel: function (viewModel, currentPage) {
            var that = this;

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

        updatePrimaryButton: function () {
            var that = this;

            that.$el.find('.cast-vote').toggle(that.model.get('results').length === 0);

            that.$el.find('.back').toggle(that.model.get('results').length > 0);
        },

        backToPolls: function () {
            this.viewModel.goToPage('polls');
        },

        chooseOption: function (event) {
            var chosenOptionId = $(event.target.parentElement).attr('id');

            this.$el.find('.options li').each(function () {
                var $this = $(this);

                $this.toggleClass('active', $this.attr('id') == chosenOptionId);
            });

            this.$el.find('.error').hide();

            this.model.set('chosenOptionId', parseInt(chosenOptionId));
        },

    	castVote: function () {
    		var that = this,
                $votingErrorMessage = that.$el.find('.error');
                url = '/api-polls.php?ip=' + window.connectionIp + '&action=vote&id=' + this.model.get('id') + '&choiceId=' +  this.model.get('chosenOptionId');

            if (!that.model.has('chosenOptionId')) {
                $votingErrorMessage.show();
            } 
            else {
                $.ajax({
                    url: url,
                    success: function (response) {
                        if (response.success) {
                            $.when(
                                that.model.fetch()
                            ).done(function () {
                                // TODO: Use that.renderResults() instead of render to just render the results to page
                                that.render();
                            })
                        } 
                        else {
                            console.log('Error voting');
                        }
                    }
                });
            }
    	}
    });
});
        