/*@ngInject*/
export default ($stateProvider, $locationProvider) => {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $stateProvider
        .state('listPosts', {
            url: '/posts',
            template: require('../view/posts.html'),
            controller: 'PostsController',
            controllerAs: 'posts',
            resolve: {
                posts: (PostService) => {
                    return PostService.getPosts().then((object) => {
                        console.log(object);
                        return object;
                    });
                }
            }
        })
        .state('chart', {
            url: '/chart',
            template: require('../view/chart.html'),
            controller: 'ChartController',
            controllerAs: 'chart'
        })
        .state('post', {
            url: '/posts/:postId',
            template: require('../view/post.html'),
            controller: 'PostController',
            controllerAs: 'post',
            resolve: {
                post: (PostService, $stateParams) => {
                    return PostService.getPost($stateParams.postId).then((object) => {
                        return object.data;
                    });
                },
                user: (PostService, post) => {
                    return PostService.getUser(post.userId).then((object) => {
                        return object.data;
                    });
                },
                comments: (PostService, post) => {
                    return PostService.getComments(post.id).then((object) => {
                        return object.data;
                    });
                }
            }
        });
}
