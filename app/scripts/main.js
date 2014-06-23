/*global require*/
'use strict';

require.config({
    baseUrl: 'bower_components/',
    shim: {
        underscore: {
            exports: '_'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: 'jquery/dist/jquery',
        backbone: 'backbone/backbone',
        underscore: 'underscore/underscore',
        bootstrap: 'sass-bootstrap/dist/js/bootstrap',
        collections: '../scripts/collections',
        models: '../scripts/models',
        routes: '../scripts/routes',
        templates: '../scripts/templates',
        views: '../scripts/views'
    }
});

require([
    'backbone'
], function (Backbone) {
    Backbone.history.start();
});
