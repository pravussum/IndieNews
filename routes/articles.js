var express = require('express');
var router = express.Router();
var FeedParser = require('feedparser'),
    request = require('request');

router.get('refresh', function(req, res, next) {



    res.render('articles', { feeds: ['feed1','anotherFeed']});
});


function readFeed(url) {
    var rssreq = request(url);
    var feedparser = new FeedParser();

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

    feedparser.on('readable', function() {
        var stream = this;
        var meta = this.meta;
        var item;
        while(item = stream.read()) {
            console.log(item.title);
            console.log(item.description);
            console.log(item.link);
            console.log(item.guid);

        }
    });
}

module.exports = router;