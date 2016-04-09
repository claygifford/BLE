angular.module('lbxApp').directive('lbxMapSearch', ['$document', '$window', 'Map', function ($document, $window, Map) {
	//http://techslides.com/demos/d3/us-zoom-county.html
	return {
		scope: {
            countyclicked: '&',
            zoominclicked: '&',
            zoomoutclicked: '&',
			items: '=',
        },
		templateUrl: '/src/views/map-search/map-search.html',
		link: function (scope, element) {
		  	var width = $("#map").width();
		  	var centered;
		  	var selectedState;
		  	var height = $("#map").parent().parent().height();
			//var height = $("#map").height();

			 scope.$watchCollection('items', function(newValue, oldValue) {

                _.difference(newValue, oldValue).forEach(function(item) {
                	var path = '';
                	if (item.isState) {
            			path = 'path#state' + item.StateFIP;
                	} else {
                		path = 'path#county' + item.StateFIP + item.CountyId;
                	}
            		d3.select(path).classed("is-selected", true);
				});
                _.difference(oldValue, newValue).forEach(function(item) {
                	var path = '';
                	if (item.isState) {
            			path = 'path#state' + item.StateFIP;
                	} else {
                		path = 'path#county' + item.StateFIP + item.CountyId;
                	}
            		d3.select(path).classed("is-selected", false);
				});
            });
			 
			angular.element($window).bind('resize', function() {
				width = $("#map").width();
			    height = $("#map").parent().parent().height();
			    //height = $("#map").height();

				svg.attr("width", width)
			       .attr("height", height);

			    background.attr("width", width)
			       	.attr("height", height);

		        projection
		        	.scale(width)
			    	.translate([width / 2, height / 2]);
        		
        		//this is slow.
        		g.select('#states').selectAll("path").attr('d', path);
        		g.select('#state-borders').attr('d', path);
        		//g.select('#counties').attr('d', path);
        		if (selectedState)
        			stateclicked(selectedState, true);
      		});

            var zoom = d3.behavior.zoom()
                .on("zoom", zoomed);

		  	var projection = d3.geo.albersUsa()
			    .scale(width)
			    .translate([width / 2, height / 2]);

	      	var path = d3.geo.path()
			    .projection(projection);
				
		  	var svg = d3.select("#map").append("svg")		  		
			    .attr("width", width)
			    .attr("height", height)
			    .call(zoom)
			    .on("dblclick.zoom", null)
			    .on("mousedown.zoom", null);

		  	var background = svg.append("rect")
			    .attr("class", "background")
			    .attr("width", width)
			    .attr("height", height)
			    .on("click", stateclicked);

		  	var g = svg.append("g");

			Map.map.then(createMap).then(selectItems);

			function createMap() {
				g.append("g")
					.attr("id", "states")
					.selectAll("path")
					.data(topojson.feature(Map.us, Map.us.objects.states).features)
					.enter().append("path")
					.attr("d", path)
					.attr("id", function(d, i)
					{
						return 'state' + d.id;
					})
					.attr("class", function(d) 
					{
						var state = Map.findState(d);
						
						if (state === undefined)
					  		return;

					  	var classes = "states";
						var found = _.find(scope.items, { 'id' : state.StateFIP });
						if (found !== undefined) {
							classes += " is-selected";
						}

					  	if (state.name.toUpperCase().charAt(0) === 'M')
					  		classes += " has-beds";
					  	else
					  		classes += " no-beds";
					  	return classes;
					})
					.on("click", stateclicked);

				g.append("path")
					.datum(topojson.mesh(Map.us, Map.us.objects.states, function(a, b) { return a !== b; }))
					.attr("id", "state-borders")
					.attr("d", path);

			}

			function selectItems() {

				if (scope.items && scope.items.length > 0) {
					var id = scope.items[0].id;
					var state = Map.stateMap[id];
					stateclicked(state);
				}
			}

			function stateclicked(d, forceResize) {
				var x, y, scale, translate;
				var forceResize = forceResize !== undefined ? !!forceResize : forceResize;
				clearCountyPaths();

				if (d && (centered !== d || forceResize)) {
				  	var bounds = path.bounds(d), 
						dx = bounds[1][0] - bounds[0][0], 
						dy = bounds[1][1] - bounds[0][1], 
						x = (bounds[0][0] + bounds[1][0]) / 2, 
						y = (bounds[0][1] + bounds[1][1]) / 2, 
						scale = .8 / Math.max(dx / width, dy / height), 
						translate = [width / 2 - scale * x, height / 2 - scale * y]; 

					centered = d;
					selectedState = d;
					createCountyPaths(selectedState);
				} else {
					scale = 1;
					translate = [width / 2 - scale * x, height / 2 - scale * y];
					centered = null;
					selectedState = null;
				}

				g.selectAll("path")
					.classed("selected", centered && function(d) { return d === centered; });

				g.transition()
					.duration(750)
   			    	.style("stroke-width", 1.5 / scale + "px") 
					.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
			}

			function createCountyPaths(state) {
				g.append("g")
				    .attr("id", "counties")
				    .selectAll("path")
				    .data(topojson.feature(Map.us, Map.us.objects.counties).features.filter(function(d)
				    {
				    	return state.id === Math.floor(d.id /1000);
				    }))
				    .enter().append("path")
				    .attr("d", path)
					.attr("id", function(d, i)
					{
						return 'county' + d.id;
					})
				    .attr("class", function(d) 
					{
						var county = Map.findCounty(d);
						
						if (county === null)
					  		return;

					  	var classes = "county-boundary";
						var found = _.find(scope.items, { 'id' : county.id });
						if (found !== undefined) {
							classes += " is-selected";
						}

					  	if (county.name.toUpperCase().charAt(0) === 'M')
					  		classes += " has-beds";
					  	else
					  		classes += " no-beds";
					  	return classes;					  	
					})
				    .on("click", countyclicked);
			}

			function zoomed() {
				if (selectedState)
					stateclicked();
                  //  proj.translate(d3.event.translate).scale(d3.event.scale);
                //g.attr("transform", "translate(" +d3.event.translate + ")scale(" + d3.event.scale + ")");
                  //  svg.selectAll("path").attr("d", path);
            }

			function clearCountyPaths() {
				g.selectAll('#counties').remove();
			}

			function countyclicked(county) {
				scope.countyclicked({county: county});
			}
    	}
	};
}]);