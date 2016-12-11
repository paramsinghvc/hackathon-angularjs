const parseString = require('xml2js').parseString;

import idb from 'idb';
const PostsDBPromise = idb.open('hackathon', 1, upgradeDB => {
    upgradeDB.createObjectStore('posts', {keyPath: 'Id'})
});

/*@ngInject*/
export default class PostService {
    constructor($http) {
        this.$http = $http;
        this.pageNo = 1;
    }
    makeGetRequest(url) {
        let self = this;
        return new Promise((resolve, reject) => {
            PostsDBPromise.then(db => {
                const tx = db.transaction('posts');
                const postsStore = tx.objectStore('posts');
                postsStore.count().then(count => {
                    console.log(count);
                    if (count !== 0) {
                        console.log('from idb');
                        postsStore.getAll().then(res => {
                            resolve(res.slice(0, 10));
                        }).catch(err => {
                            reject(err);
                        });
                    } else {
                        console.log('here');
                        self.$http.get(url).then((res) => {
                                appWorker.postMessage({
                                    cmd: 'PARSE_XML',
                                    payload: res.data
                                });

                                appWorker.addEventListener('message', function(e) {
                                    console.log('data recieved', e.data);
                                    var data = e.data;
                                    if (data.cmd === 'JSON_RES') {
                                        if (data.payload.err) reject(data.payload.err);
                                        resolve(data.payload.res);
                                    }
                                });

                            })
                            .catch((err) => {
                                reject(err);
                            })
                    }
                })



            })


        })
    }
    getPosts() {
        return this.makeGetRequest('/data/Posts.xml');
    }

    getPaginatedPosts() {
        var self = this;
        return new Promise((resolve, reject) => {
            appWorker.postMessage({
                cmd: 'GET_PAGINATED_POSTS',
                pageNo: self.pageNo
            });

            appWorker.addEventListener('message', function(e) {
                var data = e.data;
                if (data.cmd === 'PAGINATED_POSTS_RESULT') {
                    resolve(data.payload);
                    self.pageNo++;
                }
            });
        })
    }

    findPostInIDB(post) {

    }

    getPost(postId) {
        return this.$http.get('http://jsonplaceholder.typicode.com/posts/' + postId);
    }

    getUser(usreId) {
        return this.$http.get('http://jsonplaceholder.typicode.com/users/' + usreId);
    }

    getComments(postId) {
        return this.$http.get('http://jsonplaceholder.typicode.com/posts/' + postId + '/comments');
    }
}
