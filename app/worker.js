var parseString = require('xml2js').parseString;
import moment from 'moment';
import idb from 'idb';

const PostsDBPromise = idb.open('hackathon', 1, upgradeDB => {
    upgradeDB.createObjectStore('posts')
});

var PAGINATION_LIMIT = 10;
module.exports = function(self) {

    self.paginator = function(pageNo) {
        // slice(pageNo * PAGINATION_LIMIT, ((pageNo * PAGINATION_LIMIT) + PAGINATION_LIMIT));
        var lowerLimit = pageNo * PAGINATION_LIMIT;
        var upperLimit = ((pageNo * PAGINATION_LIMIT) + PAGINATION_LIMIT);

        return PostsDBPromise.then(db => {
            const tx = db.transaction('posts');
            const postsStore = tx.objectStore('posts');
            var pArr = [];
            for (let i = lowerLimit; i <= upperLimit; i++) {
                pArr.push(postsStore.get(i));
            }
            return Promise.all(pArr);
        });
    }

    self.storeInIndexedDB = function(data) {
        PostsDBPromise.then(db => {
            const tx = db.transaction('posts', 'readwrite');
            const postsStore = tx.objectStore('posts');
            data.forEach((d, i) => {
                postsStore.put(d, i);
            })
        })
    }

    self.getAllData = function() {
        return PostsDBPromise.then(db => {
            const tx = db.transaction('posts', 'readwrite');
            const postsStore = tx.objectStore('posts');
            return postsStore.getAll();
        })
    }


    self.prepareChartData = function(data) {
        var tags = data.map(d => d.Tags);
        var chartData = [];
        var flattenedTags = Array.prototype.concat.apply([], tags);
        flattenedTags.forEach(t => {
            var f = chartData.filter(r => r.label === t);

            if (f.length > 0) {
                chartData[chartData.indexOf(f[0])].value += 1;
            } else {
                chartData.push({
                    label: t,
                    value: 1
                });
            }
        })
        console.log(chartData)
        return chartData;
    }

    // self.getTagBasedDataForChart = function() {
    //     return self.getAllData().then(res => {
    //         return self.prepareChartData(res);
    //     })
    // }

    self.preparePostsData = function(data) {
        var posts = data.posts.row;
        var d = posts.map(p => p.$).map((p, idx) => {
            var f = p;
            f.Tags = p.Tags ? p.Tags.slice(1, p.Tags.length - 1).split('><') : [];
            f.Vote = Math.floor(Math.random() * 10) + 1;
            f.Id = idx;
            f.CreationDate = moment(p.CreationDate).format('DD MMM YYYY hh:mm a')
            return f;
        }).filter(p => p.Title != null);
        // self.postsData = d;
        self.storeInIndexedDB(d);
        return d.slice(0, 10);
    }

    self.getIDBCursor = function() {
        return PostsDBPromise.then(db => {
            let tx = db.transaction('posts', 'readwrite');
            var postsStore = tx.objectStore('posts');
            let cursor = postsStore.openCursor();
            return cursor;
        });
    }

    self.findById = function(post) {
        return new Promise((resolve, reject) => {
            self.getIDBCursor().then(function advanceCursor(cursor) {
                console.log(cursor.value.Id, post.Id);

                if (!cursor) {
                    reject('err')
                    return;
                };
                if (cursor.value.Id == post.Id) {
                    resolve(cursor);
                } else {
                    cursor.continue().then(advanceCursor);
                }
            })

        });
    }

    self.updateIDBField = function(post, increment) {
        self.findById(post).then(cursor => {
            let newVal = cursor.value;
            if (increment) {
                newVal.Vote += 1;
            } else {
                newVal.Vote -= 1;
            }
            cursor.update(newVal)
        }).catch(err => {
            console.log(err);
        })
    }

    self.addEventListener('message', function(e) {
        console.log(e);
        var data = e.data;
        switch (data.cmd) {
            case 'PARSE_XML':
                parseString(data.payload, function(err, res) {
                    self.postMessage({
                        cmd: 'JSON_RES',
                        payload: {
                            err: err,
                            res: self.preparePostsData(res)
                        }
                    });
                });
                break;
            case 'GET_PAGINATED_POSTS':
                self.paginator(data.pageNo).then(res => {
                    self.postMessage({
                        cmd: 'PAGINATED_POSTS_RESULT',
                        payload: res
                    })
                })

                break;
            case 'GET_CHART_DATA':
                self.getAllData().then(res => {
                    // console.log('chartData', res);
                    var chartData = self.prepareChartData(res);
                    self.postMessage({
                        cmd: 'CHART_RES',
                        payload: chartData
                    })
                })
                break;
            case 'FIND_POST_BY_ID':
                self.updateIDBField(data.payload, data.increment)

        }
    });

}
