angular.module('templates-app', ['home/home.tpl.html']);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-12\">\n" +
    "		<div class=\"alert alert-info\" role=\"alert\">Hello World!</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
