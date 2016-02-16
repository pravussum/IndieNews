$(function() {
    console.log('registering keyup for inputFeedUrl');
    $('#inputFeedUrl').on('keyup', function(e){
        if(e.keyCode === 13) {
            var params = {feedUrl: $(this).val()};
            $.get('/feeds/add', params, function(data){
               // $('#feedAddResults').html(data);
                template = Handlebars.templates["feeds.hbs"];
                $('#inputFeedUrl').val('');
                $('#feedlist').html(template({feeds:data}));
                registerRefreshHandlers();
                registerDeleteHandlers();
                registerShowArticlesHandlers();
            });
        }
    });

    function registerRefreshHandlers() {
        $('.refresh-feed').click(function (e) {
            var feedId = $(this).data('id');
            var params = {feed: feedId};
            console.log('click event for id: ' + params);
            $.get('/articles/refresh', params, function (data) {
                console.log(data);
            });
        });
    }

    function registerDeleteHandlers() {
        $('.delete-feed').click(function (e) {
            var feedId = $(this).data('id');
            var params = {feed: feedId};
            console.log('click event for id: ' + feedId);
            $.get('/feeds/delete', params, function (data) {
                console.log(data);
            });
        });
    }

    function registerShowArticlesHandlers() {
        $('.show-feed').on('click', function (e) {
            var feedId = $(this).data('id');
            console.log('click event for id: ' + feedId);
            $.get('/articles/feed/' + feedId, function (data) {
                template = Handlebars.templates["articles.hbs"];
                $('#articleContainer').html(template({articles:data.articles.rows}));
            });
        });
    }



    var template = Handlebars.templates["feeds.hbs"];

    $.get('/feeds/list', function(data) {
        $('#feedlist').html(template({feeds:data}));
        registerRefreshHandlers();
        registerDeleteHandlers();
        registerShowArticlesHandlers();
    });
});