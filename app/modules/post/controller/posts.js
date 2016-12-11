import '../sass/posts.scss';
export default class PostControllers {
    constructor($stateParams, $location, posts, PostService, $scope) {
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.posts = posts;
        this.$scope = $scope;
        this.PostService = PostService;
        // this.getNextPosts();
    }

    getNextPosts() {
        let self = this;
        this.PostService.getPaginatedPosts().then((res) => {
            self.posts = self.posts.concat(res);
            this.$scope.$digest();
            console.log('pagin', self.p);
        })
    }

    voteUp(post) {
        let posts = this.posts.filter(p => p.Title === post.Title);
        if (posts.length > 0) {
        	posts[0].Vote += 1;
        }
    }

    voteDown(post) {
        let posts = this.posts.filter(p => p.Title === post.Title);
        if (posts.length > 0) {
        	posts[0].Vote -= 1;
        }
    }

}

PostControllers.$inject = ['$stateParams', '$location', 'posts', 'PostService', '$scope'];
