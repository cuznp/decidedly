/*global require*/
'use strict';

require.config({
    baseUrl: 'js',
    shim: {
        underscore: {
            exports: '_'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        babysitter: {
            deps: ['backbone', 'underscore']
        }
    },
    paths: {
        text: '../libs/requirejs-text/text',
        jquery: '../libs/jquery/dist/jquery',
        backbone: '../libs/backbone/backbone',
        underscore: '../libs/underscore/underscore',
        bootstrap: '../libs/sass-bootstrap/dist/js/bootstrap',
        babysitter: '../libs/backbone.babysitter/lib/backbone.babysitter'
    }
});

require([
    'jquery',
    'backbone',
    'router',
    'view-model',
    'app',
    'bootstrap'
], function (
    $,
    Backbone, 
    Router,
    ViewModel,
    AppView
) {
    var viewModel = new ViewModel();

    $.when(
        viewModel.get('promises').polls
    ).done(function () {
        new Router({
            viewModel: viewModel
        });

        new AppView({
            viewModel: viewModel
        }).render();

        Backbone.history.start();
    });
});
