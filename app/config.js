/*@ngInject*/
export default ($urlRouterProvider, $locationProvider) => {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $urlRouterProvider.otherwise('/');
}
