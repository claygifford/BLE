angular.module('lbxApp')
  .directive('usMap', ['d3Service', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {},
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var width = $("#map").width(),
            height = 500,
            centered,
            selectedState;

          var svg = d3.select(ele[0])
            .append('svg')
            .style('width', '100%');


            var projection = d3.geo.albersUsa()
                .scale(1070)
                .translate([width / 2, height / 2]);

            var path = d3.geo.path()
                .projection(projection);
              
            var svg = d3.select("#map").append("svg")
                .attr("width", width)
                .attr("height", height);

            svg.append("rect")
                .attr("class", "background")
                .attr("width", width)
                .attr("height", height)
                .on("click", clicked);

            var g = svg.append("g");
            
          // Browser onresize event
          window.onresize = function() {
            scope.$apply();
          };

          // // hard-code data
          // scope.data = [
          //   {name: "Greg", score: 98},
          //   {name: "Ari", score: 96},
          //   {name: 'Q', score: 75},
          //   {name: "Loser", score: 48}
          // ];

          // Watch for resize event
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });

          scope.render = function(data) {

          }
        });
      }};
  }]);