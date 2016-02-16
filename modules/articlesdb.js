function getArticlesDb(couch) {
    console.log("Looking for db 'articles'");
    var db = couch.db('articles');
    db.exists(function(err, existing) {
        if(!existing) {
            console.log("articles db not found. Creating...");
            db.create(function(err){
                if(err) return console.error(err);
                //checkViews(db);
            });
        } else {
            console.log("Found articles db.");
            checkViews(db);
        }
    });

    return db;
}

function initializeViews(db) {
    console.log('Initializing articles views...');
    db.saveDesign('articles',
        {
            views:{
                "articlesByFeedId": {
                    map:    function(doc){
                        if(doc.feedId) {
                            //noinspection JSUnresolvedFunction
                            emit(doc.feedId, doc);
                        }
                    }
                }
            }
        },
        function(err) {
            if(err) return console.error(err);
            console.log("...articles views initialized.");
        }
    );
}

function checkViews(db) {
// ensure the articles design doc exists
    console.log("Checking articles views...");
    db.getDoc('_design/articles', function (err) {
        if (err) {
            if (err.reason === 'missing' || err.reason === 'deleted') {
                initializeViews(db);
            } else {
                console.error(err);
            }
        }
    });
}


var nodeCouchDB = require('felix-couchdb');
console.log("Connecting to couch db...");
var couch = nodeCouchDB.createClient(5984, "localhost");
var articlesDb = getArticlesDb(couch);
module.exports = articlesDb;