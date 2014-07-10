define([
	'underscore',
    'views/shared/base',
    'text!templates/shared/error.html'
], function (
	_,
    BaseView,
    ErrorTemplate
) {
    return BaseView.extend({
    	template: _(ErrorTemplate).template()
    });
});