var express = require('express');
var router = express.Router();
var util = require('util');
var feedsDb = require('../modules/feeddb');

function getFeeds(cb) {
    //feedsDb.allDocs({
    //        include_docs: true
    //    },
    //    function(err, resData) {
    //    if(err) return console.error(err);
    //    cb(resData.rows);
    //});
    feedsDb.view('feeds', 'feedsByUrl',
        {include_docs: true},
        function(err, resData) {
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
    feedsDb.view('feeds', 'feedsByUrl', {key: feedUrl}, function(err, resData) {
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

    feedsDb.client.uuids(1, function (err, resData) {
        if (err) return console.error(err);
        var uuid = resData.uuids[0];
        saveFeed(uuid, feedUrl, userId, callback);
    });
}

function saveFeed(uuid, feedUrl, userId, callback) {
    feedsDb.saveDoc(uuid,
        {
            url: feedUrl,
            name: feedUrl,
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
    renderFeeds(res);
});

router.get('/list', function(req, res, next) {
    getFeeds(function(feeds) {
        res.send(feeds);
    });
});



router.get('/add', function(req, res, next) {
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