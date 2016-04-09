angular.module('lbxApp').directive('lbxMap', ['$document', '$state', '$window', 'ClientContext', 'Map', function ($document, $state, $window, ClientContext, Map) {
	return {
		scope: true,
		templateUrl: '/src/views/map/map.html',		
		controller: function($scope, $element) {
			$scope.clickState = function(d){
				ClientContext.filter.selectedLocations.items = [d];
				$state.go("app.buy");
			}
		},
 		link: function (scope, element) {
		  	//http://techslides.com/demos/d3/us-zoom-county.html
			var width = $("#map").width(),
			    height = 500,
			    centered,
			    selectedState;

			angular.element($window).bind('resize', function() {
				width = $("#map").width();
			    //height = $("#map").height();

				svg.attr("width", width);
			    	//.attr("height", height);

			    background.attr("width", width);
			    	//.attr("height", height);

		        projection
		        	.scale(1070)
			    	.translate([width / 2, height / 2]);
        		
        		//this is slow.
        		g.select('#states').selectAll("path").attr('d', path);
        		g.select('#state-borders').attr('d', path);
      		});		

			var projection = d3.geo.albersUsa()
			    .scale(1070)
			    .translate([width / 2, height / 2]);

			var path = d3.geo.path()
			    .projection(projection);
				
			var svg = d3.select("#map").append("svg")
			    .attr("width", width)
			    .attr("height", height);

			var background = svg.append("rect")
			    .attr("class", "background")
			    .attr("width", width)
			    .attr("height", height)
			    .on("click", clicked);

			var g = svg.append("g");

			Map.map.then(createMap);

			function createMap() {
				g.append("g")
					.attr("id", "states")
					.selectAll("path")
					.data(topojson.feature(Map.us, Map.us.objects.states).features)
					.enter().append("path")
					.attr("d", path)
					.attr("class", function(d) 
					{
						var state = Map.findState(d);
						
						if (state === undefined)
					  		return;

					  	if (state.name.toUpperCase().charAt(0) === 'M')
					  		return "states has-beds";
					    return "states no-beds";
					})
					.on("click", clicked);

				g.append("path")
					.datum(topojson.mesh(Map.us, Map.us.objects.states, function(a, b) { return a !== b; }))
					.attr("id", "state-borders")
					.attr("d", path);
			}

			function clicked(d) {

				if (!d) {
					return;
				}

				var state = {id: d.id, name: Map.findStateName(d), isState: true};
				var scope = $("#map").scope();				
				scope.clickState(state);
			}		
       	}
	};
}]);