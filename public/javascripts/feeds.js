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
            });
        }
    });

    function registerRefreshHandlers() {
        $('.refresh-feed').click(function (e) {
            var feedurl = $(this).data('id');
            var params = {feed: feedurl};
            console.log('click event for id: ' + params);
            $.get('/articles/refresh', params, function (data) {
                console.log(data);
            });
        });
    }

    var template = Handlebars.templates["feeds.hbs"];

    $.get('/feeds/list', function(data) {
        $('#feedlist').html(template({feeds:data}));
        registerRefreshHandlers();
    });
});