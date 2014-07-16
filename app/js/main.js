/*global require*/
'use strict';

// TODO: Pass in connecton IP via Rails
window.connectionIp = '172.7.16.' + (Math.floor(Math.random() * (40 - 30 + 1)) + 30);

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
        },
        jqplot: {
            deps: ['jquery']  
        },
        barRenderer: {
            deps: ['jqplot']
        },
        categoryAxisRenderer: {
            deps: ['jqplot']
        },
        pointLabels: {
            deps: ['jqplot']
        }
    },
    paths: {
        text: '../libs/requirejs-text/text',
        jqplot: '../libs/jqplot/jquery.jqplot',
        jquery: '../libs/jquery/dist/jquery',
        backbone: '../libs/backbone/backbone',
        underscore: '../libs/underscore/underscore',
        bootstrap: '../libs/sass-bootstrap/dist/js/bootstrap',
        babysitter: '../libs/backbone.babysitter/lib/backbone.babysitter',
        barRenderer: '../libs/jqplot/plugins/jqplot.barRenderer',
        pointLabels: '../libs/jqplot/plugins/jqplot.pointLabels',
        categoryAxisRenderer: '../libs/jqplot/plugins/jqplot.categoryAxisRenderer'
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
