var express = require('express');
var router = express.Router();
var couch;
var util = require('util');

function getFeeds(cb) {
    couch.allDocs(function(err, resData) {
        if(err) return console.error(err);
        cb(resData.rows);
    });
}

function renderFeeds(res) {
    getFeeds(function(feeds){
        res.render('feeds', {feeds: feeds});
    });
}

function addFeed(feedUrl, userId) {
    // check if document exists
    couch.getDoc(feedUrl, function (err, resData) {
        if(err) {
            console.log('Feed ' + feedUrl + ' not found. Inserting.');
            couch.saveDoc(feedUrl /* feedUrl as ID */,
                {
                    url: feedUrl,
                    user: userId
                },
                function(err, resData) {
                    if(err) return console.error(err);
                    console.dir(resData);
                }
            );
        } else {
            console.log('Feed ' + feedUrl + ' already exists. Doing nothing.');
        }
    });
}

router.get('/', function(req, res, next) {
    couch = req.couch.db('feeds');
    renderFeeds(res);
});

router.get('/list', function(req, res, next) {
    couch = req.couch.db('feeds');
    getFeeds(function(feeds) {
        res.send(feeds);
    });
});

router.get('/add', function(req, res, next) {
    couch = req.couch.db('feeds');
    var feedUrl = req.query.feedUrl;
    console.log('adding "' + feedUrl + '" as feed.');
    addFeed(feedUrl, /* TODO fill userId*/ 1);
    res.send('<p>Feed added: ' + feedUrl + '</p>');
});

module.exports = router;