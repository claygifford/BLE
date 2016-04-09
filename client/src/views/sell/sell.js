angular.module('lbxApp')
.controller('sellController', ['$scope', '$state', 'ClientContext', 'Map', function ($scope, $state, ClientContext, Map) {

	$scope.filter = {};
	$scope.actions = {};
	$scope.properties = {};

	$scope.listing = {};
	$scope.account = angular.copy(ClientContext.AppUser);
		
	Map.map.then(function () {
		$scope.filter.states = Map.fipsStateCodes;
	});

	$scope.$watch('listing.StateObject', function() {
		var state = $scope.listing.StateObject;

		if (state === Object(state))
		{
			$scope.listing.State = state.name;
			$scope.listing.StateFIP = state.StateFIP;
			$scope.filter.counties = Map.findAllCountiesByState(state);
		}
		else
		{
			$scope.listing.State = "";
			$scope.listing.StateFIP = "";			
			$scope.filter.counties = [];
		}
	});
	  
	$scope.$watch('listing.CountyObject', function() {
		var county = $scope.listing.CountyObject;

		if (county === Object(county))
		{
			$scope.listing.County = county.name;
			$scope.listing.CountyFIP = county.CountyFIP;
		}
		else
		{
			$scope.listing.County = "";
			$scope.listing.CountyFIP = "";
		}
	});

	$scope.$watch('account.Facility', function() {
		var facility = $scope.account.Facility;

		if (facility === Object(facility))
		{
			var state = Map.findStateByAbbv(facility.State);
			$scope.listing.StateObject = state;

			var county = Map.findCountyByNameAndState(facility.County, state);
			$scope.listing.CountyObject = county;
		}
	});

	$scope.getCompanies = function (val) {

		return ClientContext.findCompanies(val).then(function (result) {
	 		if (result.isSuccess) {
	 			return result.data;
			}
	 	});;
	};

	var calculatePrice = function () {

		if ($scope.listing.AskingPricePerBed === undefined)
			return;
		if ($scope.listing.NumberOfBeds === undefined)
			return;

		$scope.properties.Price = $scope.listing.AskingPricePerBed * $scope.listing.NumberOfBeds;
	};

	$scope.$watch('listing.AskingPricePerBed', function() {
		calculatePrice();
	});

	$scope.$watch('listing.NumberOfBeds', function() {
		calculatePrice();
	});

	$scope.submit = function() {
		$scope.actions.isBusy = true;
		$scope.actions.message = null;

		var createListing = {};
		createListing.Listing = $scope.listing;
		createListing.Account = $scope.account;

	 	ClientContext.createListing(createListing).then(function (result) {

	 		$scope.actions.isBusy = false;

	 		if (result.isSuccess) {
	 			$('#demo-cls-wz').bootstrapWizard('next');
	 		}
	 		else {
	 			// need error handling here.
	 		}
	 	});	
	};

	$scope.cancel = function() {		
		$scope.listing = {};
		$scope.account = angular.copy(ClientContext.AppUser);

		var element = $('#sell-form');
        var fv = element.data('formValidation');
        fv.resetForm();
		$('#demo-cls-wz').bootstrapWizard('first');
	};

	$scope.close = function() {
		$state.go('app.buy');
	};
}]);