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

function addFeed(feedUrl, userId, callback) {
    // check if url already exists
    couch.view('feeds', 'feedsByUrl', {key: feedUrl}, function(err, resData) {
        if(err) return console.error(err);
        if(resData.rows.length == 0)
            addNewFeed(feedUrl, userId, callback);
        else {
            console.log('Feed with URL ' + feedUrl + ' already exists. Doing nothing.');
            callback();
        }
    });
}

function addNewFeed(feedUrl, userId, callback) {

    couch.client.uuids(1, function (err, resData) {
        if (err) return console.error(err);
        var uuid = resData.uuids[0];
        saveFeed(uuid, feedUrl, userId, callback);
    });
}

function saveFeed(uuid, feedUrl, userId, callback) {
    couch.saveDoc(uuid,
        {
            url: feedUrl,
            user: userId
        },
        function (err, resData) {
            if (err) return console.error(err);
            console.log('Successfully added feed with id ' + uuid + ' and URL ' + feedUrl);
            callback();
        }
    );
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
    addFeed(feedUrl, /* TODO fill userId*/ 1, function(){sendFeedsAsResult(res)});
});

function sendFeedsAsResult(res) {
    getFeeds(function(feeds) {
        res.send(feeds);
    });
}

function defErrIgnResult(err) {
    if(err) return console.error(err);
}

module.exports = router;