$(function() {
    console.log('registering keyup for inputFeedUrl');
    $('#inputFeedUrl').on('keyup', function(e){
        if(e.keyCode === 13) {
            var params = {feedUrl: $(this).val()};
            $.get('/feeds/add', params, function(data){
               $('#feedAddResults').html(data);
            });
        };
    });

    var template = Handlebars.compile($("#tmpl_feeds").html());
    $.get('/feeds/list', function(data) {
        $('#feedlist').html(template(data));
    });
});