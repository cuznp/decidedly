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
    		'click li': 'viewPoll'
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
                    creator: poll.get('creator'),
                    deadline: deadline.toDateString()
                });
            });    
            
            return templateData;        
        },

    	viewPoll: function (event) {
    		var id = $(event.target.parentElement).attr('id');

    		this.viewModel.goToPage('poll', id);
    	},

        launchLogin: function () {
            var thediv=document.getElementById('displaybox');
            if(thediv.style.display == "none"){
                thediv.style.display = "";
                thediv.innerHTML = "<table width='100%' height='100%'><tr><td align='center' valign='middle' width='100%' height='100%'><object classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' codebase='http://www.apple.com/qtactivex/qtplugin.cab' width='640' height='500'><param name='src' value='http://cowcast.creativecow.net/after_effects/episodes/Shape_Tips_1_POD.mp4'><param name='bgcolor' value='#000000'><embed src='http://cowcast.creativecow.net/after_effects/episodes/Shape_Tips_1_POD.mp4' autoplay='true' pluginspage='http://www.apple.com/quicktime/download/' height='500' width='640' bgcolor='#000000'></embed></object><br><br><a href='#' onclick='return clicker();'>CLOSE WINDOW</a></td></tr></table>";
            }else{
                thediv.style.display = "none";
                thediv.innerHTML = '';
            }
            return false;
        }
    });
});
        