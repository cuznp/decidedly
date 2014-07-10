define([
    'views/shared/base',
    'models/poll',
    'views/public/poll',
    'views/public/polls',
    'views/shared/error'
], function (
    BaseView,
    PollModel,
    PollView,
    PollsView,
    ErrorView
) {
    return BaseView.extend({
    	el: '#ui-main',

        initialize: function (options) {
            var that = this;

            BaseView.prototype.initialize.apply(that, arguments);

            that.childViews.add(new PollView({
                el: '#poll',
                viewModel: that.viewModel,
                model: new PollModel
            }), 'poll');

            that.childViews.add(new PollsView({
                el: '#polls-wrapper',
                viewModel: that.viewModel,
                collection: that.viewModel.get('polls')
            }), 'polls');

            that.childViews.add(new ErrorView({
                el: '#error',
            }), 'error');

            that.listenTo(that.viewModel, 'change:currentPage', that.showRequestedPage);
        },

        render: function() {
    		BaseView.prototype.render.apply(this, arguments);

            this.showRequestedPage();

            return this;
    	},

        showRequestedPage: function () {
            var requestedPageView, errorView,
                that = this,
                requestedPage = that.viewModel.get('currentPage');
            
            if (!requestedPage) {
                return;
            }

            requestedPageView = that.childViews.findByCustom(requestedPage.name);

            if (!requestedPageView) {
                requestedPageView = that.childViews.findByCustom('error');
            }

            if(requestedPageView.rendered === false) {
                requestedPageView.render();
            }

            if (that.currentPageView) {
                that.currentPageView.$el.hide();
            }

            requestedPageView.$el.show();

            that.currentPageView = requestedPageView;
        }
    });
});