/*@ngInject*/
export default class Pagination {
    constructor() {
        this.restrict = 'A';
        this.scope = {
            fetchNextResults : '&'
        };
    }

    compile(tElement) {
        return this.link.bind(this);
    }


    link(scope, element, attributes) {
        var scrollHandler = function(event) {
            console.log(document.body.scrollHeight, (document.body.scrollTop + window.innerHeight).toFixed(0));
            if (document.body.scrollHeight == Math.abs(document.body.scrollTop + window.innerHeight).toFixed(0)) {
                console.log('bottom hit');
                scope.fetchNextResults();
            }
        }

        document.addEventListener('scroll', scrollHandler);
    }

}
