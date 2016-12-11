
export default class ChartController {
    constructor($stateParams, $location, PostService, $scope) {
        this.$stateParams = $stateParams;
        this.$location = $location;
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

ChartController.$inject = ['$stateParams', '$location', 'PostService', '$scope'];
