define([
    'underscore',
    'views/shared/base',
    'text!templates/public/poll.html',
    'jqplot',
    'barRenderer',
    'pointLabels',
    'categoryAxisRenderer'
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
            var deadline, deadlineMessage,
                pollClosed = this.model.get('results').length > 0,
                templateData = BaseView.prototype.templateData.apply(this, arguments);

            if (pollClosed) {
                deadlineMessage = 'Voting has ended';
            } 
            else {
                deadline = new Date();

                deadline.setTime(this.model.get('endDate') * 1000);

                deadlineMessage = 'Voting ends on: ' + deadline.toDateString();
            }

            templateData.deadlineMessage = deadlineMessage; 

            return templateData;
        },

        render: function () {
            var that = this;

            BaseView.prototype.render.apply(that, arguments);

            that.updateVotingStatus();

            that.renderResults();

            return that;
        },

        renderResults: function () {
            var choices, ticks, resultsData,
                results = this.model.get('results');

            this.$('.results-wrapper').toggle(results.length > 0);

            if (this.resultsPlot) {
                this.resultsPlot.destroy();
            }

            if (results.length) {
                choices = this.model.get('choices');

                resultsData = _(results).pluck('votes');

                this.resultsPlot = $.jqplot('results-graph', [resultsData], {
                    seriesDefaults: {
                        renderer:$.jqplot.BarRenderer,
                        shadowAngle: 135,
                        rendererOptions: {
                            barDirection: 'horizontal'
                        },
                        pointLabels: { 
                            show: true
                        }
                    },
                    axes: {
                        yaxis: {
                            ticks: _(choices).pluck('title'),
                            renderer: $.jqplot.CategoryAxisRenderer
                        },
                        xaxis: {
                            showTicks: false
                        }
                    }
                });
            }            
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

        updateVotingStatus: function () {
            var votedChoiceId,
                that = this,
                results = that.model.get('results');

            if (results.length) {
                _(results).each(function (result) {
                    if (result.votedFor === true) {
                        votedChoiceId = result.choiceId;
                    } 
                })

                if (votedChoiceId) {
                    that.$el.find('#' + votedChoiceId).addClass('active');    
                }
            }

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

            if (!that.model.has('chosenOptionId')) {
                $votingErrorMessage.show();
            } 
            else {
                $.ajax({
                    url: '/api-polls.php?ip=' + window.connectionIp + '&action=vote&id=' + that.model.get('id') + '&choiceId=' +  that.model.get('chosenOptionId'),
                    success: function (response) {
                        if (response.success) {
                            $.when(
                                that.model.fetch()
                            ).done(function () {
                                that.renderResults();

                                that.updateVotingStatus();
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
        