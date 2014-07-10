define([
    'underscore',
    'jquery',
    'backbone',
    'babysitter'
], function (
    _,
    $,
    Backbone
) {
    return Backbone.View.extend({
        initialize: function (options) {
            var that = this;

            options = options || {};

            that.viewModel = options.viewModel;

            Backbone.View.prototype.initialize.apply(that, arguments);

            that.childViews = new Backbone.ChildViewContainer();

            that.rendered =  false; 
        },

        renderTo: function ($el, insertionMethod) {
            insertionMethod = insertionMethod || 'append';

            $el[insertionMethod](this.el);

            return this.render();
        },

        render: function () {
            var that = this;

            if (that.template) {
                that.$el.html(that.template(that.templateData()));
            }

            that.rendered = true;

            return that;
        },

        templateData: function () {
            var templateData = {};

            if (this.model) {
                _(templateData).extend(this.model.attributes);
            }

            return templateData;
        },

        addChildren: function (models, View, $container) {
            var that = this;

            $container = $container || this.$el;

            models.each(function (model) {
                var view = that.childViews.findByModel(model);

                if (!view) {
                    view = new View({
                        viewModel: that.viewModel,
                        model: model
                    }).renderTo($container);

                    that.childViews.add(view);
                }
            });
        },

        remove: function () {
            this.removeChildren();

            return Backbone.View.prototype.remove.apply(this, arguments);
        },

        removeChildren: function () {
            this.childViews.each(function (childView) {
                childView.remove();
            });

            this.childViews = new Backbone.ChildViewContainer();
        },

        removeChild: function (view) {
            this.childViews.remove(view);
            view.remove();
        }
    });
});