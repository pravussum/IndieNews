function initializeViews(db) {
    console.log('Initializing couchdb views...');
    db.saveDesign('feeds',
        {
            views:{
                "feedsByUrl": {
                    map:    function(doc){
                        if(doc.url) {
                            //noinspection JSUnresolvedFunction
                            emit(doc.url, doc);
                        }
                    }
                }
            }
        },
        function(err) {
            if(err) return console.error(err);
            console.log("...views initialized.");
        }
    );
}

function checkViews(db) {
// ensure the feeds design doc exists
    console.log("Checking views...");
    db.getDoc('_design/feeds', function (err) {
        if (err) {
            if (err.reason === 'missing') {
                initializeViews(db);
            } else {
                console.error(err);
            }
        }
    });
}

function getFeedsDb(couch) {
    console.log("Looking for db 'feeds'");
    var db = couch.db('feeds');
    db.exists(function(err, existing) {
        if(!existing) {
            console.log("feeds db not found. Creating...");
            db.create(function(err){
                if(err) return console.error(err);
                checkViews(db);
            });
        } else {
            console.log("Found.");
            checkViews(db);
        }
    });

    return db;
}

var nodeCouchDB = require('felix-couchdb');
console.log("Connecting to couch db...");
var couch = nodeCouchDB.createClient(5984, "localhost");
var feedsDb = getFeedsDb(couch);
module.exports = feedsDb;