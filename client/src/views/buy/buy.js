angular.module('lbxApp')
.controller('buyController', ['$window', '$scope', '$stateParams', '$state', '$timeout', '$uibModal', 'ClientContext', 'Map', function ($window, $scope, $stateParams, $state, $timeout, $uibModal, ClientContext, Map) {

	$scope.actions = {};
	$scope.Map = Map;
	$scope.filter = ClientContext.filter;
	$scope.filter.selectedLocations.items = [];
	$scope.counties = [];
	$scope.states = [];
    $scope.selectedOption = null;

	$scope.sellBed = function(){
		$state.go('app.sell');
	}

	$scope.selectItem = function(e){
		e.stopPropagation();
    	e.preventDefault();
	}

	$scope.handleMenuClick = function() {
		var menu = $(this).next('.dropdown-menu');
		menu.toggle();
		menu.dropdown('toggle');
	}
	
	$scope.onCountyClick = function(county){
		
		var county = Map.findCounty(county);

		var found = _.find($scope.filter.selectedLocations.items, { 'id' : county.id });
		if (found === undefined) {
			$scope.filter.selectedLocations.items.push(county);
		} else {
			var index = $scope.filter.selectedLocations.items.indexOf(found);
			$scope.filter.selectedLocations.items.splice(index, 1);
		}

		$scope.$apply();
	}

	$scope.onCloseClicked = function(county){
		
		$scope.actions.showPlaceBid = false;
	}

	$scope.toggleListings = function() {
		$scope.getListings();
	}

	$scope.getFilter = function() {
		var counties = [];

		for (var i=0; i<$scope.counties.length; i++) {
			var county = $scope.counties[i];
			if (county.isCounty && county.isChecked) {
				counties.push(county.value.CountyFIP);
			}
		}

		var states = [];

		for (var i=0; i<$scope.states.length; i++) {
			var state = $scope.states[i];
			if (state.isChecked) {
				states.push(state.value.StateFIP);
			}
		}


		var filter = 
		{
			States : states,
			Counties : counties,
			PricePerBed : $scope.filter.pricePerBed,
			RealEstate :  $scope.filter.realEstateFilter
		};

		return filter;
	}

	$scope.getListings = function () {

		var filter = $scope.getFilter();

		$scope.actions.isBusy = true;

		ClientContext.getListings(filter).then(function (result) {
			$scope.actions.isBusy = false;
			if (result.isSuccess) {
				$scope.filter.listings = result.data;
			}
		});
	};

	$scope.getSearches = function() {
		ClientContext.getSearches().then(function (result) {			
			if (result.isSuccess) {
				$scope.searches = result.data;
			}
		});
	}

	$scope.setStates = function() {
	    if ($scope.Map.states === null)
	    	return;

	    var items = [];

	    for (var i=0; i<$scope.Map.states.length; i++) {
	    	var state = $scope.Map.states[i];
	    	items.push({
	      		index: i,
	      		label: state.name,
	      		value: state,
	      		isChecked: true
	    	});
	    }
	    $scope.states = items;
	}

	$scope.$watch('$scope.Map.states', function(newCol, oldCol, scope) {
		$scope.setStates();
	});


	$scope.setCounties = function() {
	    if ($scope.Map.counties === null)
	    	return;

	    $scope.countiesByStates = [];

	    for (var i=0; i<$scope.Map.states.length; i++) {
	    	var items = [];
	    	var state = $scope.Map.states[i];
	    	$scope.countiesByStates[state.StateFIP] = $scope.Map.findAllCountiesByState(state);
	    }
	}

	$scope.filterCounties = function() {
	    var items = [];

	    var index = 0;
		for (var i=0; i<$scope.states.length; i++) {
			var state = $scope.states[i];
			if (state.isChecked) {

		    	items.push({
		      		index: index++,	      		
		      		label: state.label,
		      		isCounty: false,
		      		value: state
		    	});

				var counties = $scope.countiesByStates[state.value.StateFIP];	

				for (var j=0; j<counties.length; j++) {
					var county = counties[j];
					items.push({
	     	 			index: i,	      		
	     	 			label: county.name,
	     	 			isCounty: true,
	     	 			value: county,
	     	 			isChecked: true
	    			});
				}
			}
		}

		$scope.counties = items;
	}

	$scope.$watch('$scope.Map.counties', function(newCol, oldCol, scope) {
		$scope.setCounties();
	});

	$scope.$on('mapLoaded', function() {
		$scope.setStates();
		$scope.setCounties();
		$scope.filterCounties();
		$scope.getListings();
    });

    $scope.onStateSelect = function(option) {
       	option.isChecked = !option.isChecked;
		
		$scope.filterCounties();
   		$scope.getListings();
    };

    $scope.toggleStates = function(value) {
        for (var i=0; i<$scope.states.length; i++) {
        	var state = $scope.states[i];
        	state.isChecked = value;
        }
		$scope.filterCounties();
        $scope.getListings();
    };

    $scope.onCountySelect = function(option) {
       	option.isChecked = !option.isChecked;

       	$scope.getListings();
    };

    $scope.toggleCounties = function(value) {
        for (var i=0; i<$scope.counties.length; i++)
        {
        	var county = $scope.counties[i];
        	county.isChecked = value;
        }

        $scope.getListings();
    };

    $scope.toggleRealEstate = function(value) {
    	for (var i=0; i<$scope.filter.realEstate.length; i++)
        {
        	var realEstate = $scope.filter.realEstate[i];
        	realEstate.isChecked = value;
        }

        $scope.getListings();
    };
	
	$scope.placeBid = function(listing) {
		
		var bid = {};

		bid.ListingId = listing.Id;
		bid.StateFIP = listing.StateFIP;
		bid.State = listing.State;
		bid.County = listing.County;
		bid.CountyFIP = listing.CountyFIP;
		bid.Type = "New Construction";

		var modalInstance = $uibModal.open({
	      	//animation: $scope.animationsEnabled,
	      	animation: false,
	      	templateUrl: 'src/views/place-bid/place-bid.html',
	      	scope: $scope,
	      	//templateUrl: 'myModalContent.html',	      	
	      	controller: 'placeBidController',
	      	size: 'lg',	      	
	      	resolve: {
		    	bid: function () {
	        		return bid;
	       		}
      		}
		});
	}

	$scope.saveSearch = function() {
		
		var search = {};

		search.filter = $scope.getFilter();

		var modalInstance = $uibModal.open({
	      	//animation: $scope.animationsEnabled,
	      	animation: false,
	      	templateUrl: 'src/views/save-search/save-search.html',
	      	controller: 'saveSearchController',
	      	//size: 'lg',
	      	resolve: {
		    	search: function () {
	        		return search;
	       		}
      		}
		});
	}
	
	$scope.requestInformation = function(listing) {

		var modalInstance = $uibModal.open({
	      	//animation: $scope.animationsEnabled,
	      	animation: false,
	      	templateUrl: 'src/views/request-information/request-information.html',
	      	scope: $scope,
	      	//templateUrl: 'myModalContent.html',	      	
	      	controller: 'requestInformationController',
	      	//size: 'lg',	      	
	      	resolve: {
		    	listing: function () {
	        		return listing;
	       		}
      		}
		});
	}

	if ($scope.Map.isMapLoaded)
	{
		$scope.setStates();
		$scope.setCounties();
		$scope.filterCounties();
		$scope.getListings();
	}

	$scope.getSearches();
}]);