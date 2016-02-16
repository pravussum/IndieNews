(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['feeds.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <li class=\"list-group-item show-feed\" data-id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\">\r\n            <span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.name : stack1), depth0))
    + " <span class=\"badge\">20</span></span>\r\n\r\n            <div class=\"btn-group btn-group-sm\">\r\n                <button data-id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\" type=\"button\" class=\"btn btn-default refresh-feed\">\r\n                    <span class=\"glyphicon glyphicon-refresh\" aria-hidden=\"true\"></span>\r\n                </button>\r\n                <button data-id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\" type=\"button\" class=\"btn btn-default delete-feed\">\r\n                    <span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\r\n                </button>\r\n            </div>\r\n\r\n        </li>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"list-group\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.feeds : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true});
})();