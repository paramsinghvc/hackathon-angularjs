import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import angular from 'angular';
// require('angular-animate');
// require('angular-aria');

import ngMaterial from 'angular-material';
import uirouter from 'angular-ui-router';
import sanitize from 'angular-sanitize';


if (TEST) {
    require('angular-mocks');
}

import './sass/style.scss';
import routing from './config';
import home from './modules/home';
import post from './modules/post';
// web worker

import work from 'webworkify-webpack';
var w = work(require.resolve('./worker.js'));
window.appWorker = w;

/*@ngInject*/
angular.module('app', [uirouter, sanitize, home, post, ngMaterial])
    .config(routing)
    .run(['$rootScope', ($root) => {
        $root.$on('$stateChangeStart', (e, newUrl, oldUrl) => {
            if (newUrl !== oldUrl) {
                $root.loadingView = true;
            }
        });
        $root.$on('$stateChangeSuccess', () => {
            $root.loadingView = false;
        });
        $root.$on('$stateChangeError', () => {
            $root.loadingView = false;
        });
    }]);
