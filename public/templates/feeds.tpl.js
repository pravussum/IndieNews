(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['feeds.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "        <li>"
    + alias2(alias1((depth0 != null ? depth0.key : depth0), depth0))
    + "&nbsp;\n            <button data-id=\""
    + alias2(alias1((depth0 != null ? depth0.key : depth0), depth0))
    + "\" type=\"button\" class=\"btn btn-default refresh-feed\">\n                <span class=\"glyphicon glyphicon-refresh\" aria-hidden=\"true\"></span>\n                Refresh\n            </button>\n        </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.feeds : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true});
})();