import angular from 'angular';
import uirouter from 'angular-ui-router';

import routes from './config/routes';
import Pagination from './directive/pagination';
import Chart from './directive/Chart';
import PostService from './service/service';
import PostsController from './controller/posts';
import PostController from './controller/post';
import ChartController from './controller/chart';

export default angular.module('post', [uirouter])
  .config(routes)
  .service('PostService', PostService)
  .controller('PostsController', PostsController)
  .controller('PostController', PostController)
  .controller('ChartController', ChartController)
  .directive('pagination', () => new Pagination())  
  .directive('chart', () => new Chart())  
  .name;
