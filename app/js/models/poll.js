define([
    'backbone',
], function (
    Backbone
) {
    return Backbone.Model.extend({
    	url: function () {
    		var getParams = '',
    			baseUrl = 'api-polls.php';
    		
    		if (this.id) {
    			getParams += '?id=' + this.id;
    		}

    		return baseUrl + getParams;
    	},

   		defaults: {
   			title: '',
			description: '',
			choices: [],
			results: [],
			creator: {
				avatar: 'http://placesheen.com/400/200'
			},
			startDate: null,
			endDate: null
   		}
    });
});