var express = require('express');
var router = express.Router();
var FeedParser = require('feedparser');
var request = require('request');
var articlesDb = require('../modules/articlesdb');
var feedDb = require('../modules/feeddb');
var iconv = require('iconv-lite');

router.get('/refresh', function(req, res, next) {
    var feedId = req.query.feed;
    if(!feedId)
        res.send({result: 'Parameter feed not set'});

    feedDb.getDoc(feedId, function(err, resData) {
        if(err) return console.error(err);
        var feedUrl = resData.url;
        readFeed(feedId, feedUrl, articleHandler);
    });
    res.send({result: 'OK'});
});

router.get('/', function(req, res, netxt) {
    res.send({result: 'OK'});
    // res.render('articles', { feeds: ['feed1','anotherFeed']});
});

router.get('/feed/:feedId', function(req, res, next){
    var feedId = req.params.feedId;
    if(!feedId) {
        res.status(400);
        res.send('Parameter feedId not set.');
    }
    articlesDb.view('articles','articlesByFeedId',{key:feedId},
        function(err, resData) {
            if(err) return console.error(err);
            res.send({articles:resData});
        }
    );
});

router.get('/all', function(req, res, next){
    articlesDb.view('articles','articlesByFeedId',
        function(err, resData) {
            if(err) return console.error(err);
            res.send({articles:resData});
        }
    );
});

function saveNewArticle(articleId, feedId, item) {
    articlesDb.saveDoc(articleId, {
            feedId: feedId,
            title: item.title,
            description: item.description,
            link: item.link
        },
        function (err, resData) {
            if (err) return console.error(err);
        });
}
function articleHandler(feedId, item) {

    var articleId = encodeURIComponent(item.guid);

    articlesDb.getDoc(articleId, function(err, resData) {
       if(err) {
           if(err.reason === 'missing') {
               console.log("Saving new article " + articleId);
               saveNewArticle(articleId, feedId, item);
           }
           return console.err;
       }
    });

}

function updateFeedMeta(feedId, meta) {

    feedDb.getDoc(feedId, function(err, feed) {
        if(err)
            return console.error(err);
        if(feed.name === feed.url) {
            // update feed title from metadata
            console.log("Updating feed title from metadata...");
            feed.name = meta.title;
            feed.imageUrl = meta.image.url
            feedDb.saveDoc(feed, function(err, resData) {
                if(err) return console.error(err);
            });
        }
    });

}
function readFeed(feedId, feedUrl, articleHandler) {
    var rssreq = request({
        uri: feedUrl,
        encoding: "utf-8"
    });
    var feedparser = new FeedParser({});

    rssreq.on('error', function(errMsg) {
        console.error(errMsg);
    });

    rssreq.on('response', function(rssresponse) {
        var stream = this;
        if(rssresponse.statusCode != 200)
            return this.emit('error', new Error('Bad status code'));
        stream.pipe(feedparser);
    });

    feedparser.on('error', function(errMsg) {
        console.error(errMsg);
    });

    feedparser.on('meta', function(){
        console.log("meta event");
        var stream = this;
        var meta = this.meta;
        updateFeedMeta(feedId, meta);
    });

    feedparser.on('readable', function() {
        var stream = this;
        var meta = this.meta;
        var item;
        var encoding = meta["#xml"].encoding;
        if(encoding !== 'utf-8') {
            console.log('Converting encoding ' + encoding + ' to UTF-8');
            // TODO convert encoding
        }
        while (item = iconv.decode(stream.read(), 'ISO-8859-1')) {
            articleHandler(feedId, item);
        }
    });
}

module.exports = router;