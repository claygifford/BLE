
angular.module('lbxApp')
.controller('placeBidController', ['$scope', '$uibModalInstance', 'ClientContext', 'Map', 'bid', function ($scope, $uibModalInstance, ClientContext, Map, bid) {

	$scope.bid = bid;
	$scope.actions = {};
	$scope.properties = {};
	$scope.newLocation = {};
	$scope.existingLocation = {};
	$scope.location = {};
	$scope.location.Type = 'New Construction';
	$scope.account = angular.copy(ClientContext.AppUser);

	Map.map.then(function () {
		$scope.filter.newStates = Map.fipsStateCodes;
		$scope.filter.existingStates = Map.fipsStateCodes;
	});

	$scope.cancel = function(){
	 	$uibModalInstance.close();	 	
	}
	
	$scope.close = function() {
		$uibModalInstance.close();
	};

	var calculatePrice = function () {

		if ($scope.bid.PricePerBed === undefined)
			return;
		if ($scope.bid.NumberOfBeds === undefined)
			return;

		$scope.properties.Price = $scope.bid.PricePerBed * $scope.bid.NumberOfBeds;
	    $scope.properties.LbeCommission = $scope.properties.Price * .05;
	    $scope.properties.TotalPurchasePrice = $scope.properties.Price + $scope.properties.LbeCommission;
	};

	$scope.$watch('bid.PricePerBed', function() {
		calculatePrice();
	});

	$scope.$watch('bid.NumberOfBeds', function() {
		calculatePrice();
	});

	$scope.submit = function(){

		$scope.actions.isBusy = true;
		$scope.actions.message = null;

		var createBid = {};
		createBid.Bid = $scope.bid;
		createBid.Location = $scope.location;	
		createBid.Account = $scope.account;
		createBid.Message = $scope.bid.Comments;

		ClientContext.createBid(createBid).then(function (result) {

			$scope.actions.isBusy = false;

			if (result.isSuccess) {
				$('#bid-wz').bootstrapWizard('next');
			}
			else {
			}
		});		
	}

	$scope.$watch('newLocation.StateObject', function() {
		var state = $scope.newLocation.StateObject;

		if (state === Object(state))
		{
			$scope.newLocation.State = state.name;
			$scope.newLocation.StateFIP = state.StateFIP;
			$scope.filter.newCounties = Map.findAllCountiesByState(state);
		}
		else
		{
			$scope.newLocation.State = "";
			$scope.newLocation.StateFIP = "";			
			$scope.filter.newCounties = [];
		}
	});
	  
	$scope.$watch('newLocation.CountyObject', function() {
		var county = $scope.newLocation.CountyObject;

		if (county === Object(county))
		{
			$scope.newLocation.County = county.name;
			$scope.newLocation.CountyFIP = county.CountyFIP;
		}
		else
		{
			$scope.newLocation.County = "";
			$scope.newLocation.CountyFIP = "";
		}
	});

	$scope.$watch('existingLocation.StateObject', function() {
		var state = $scope.existingLocation.StateObject;

		if (state === Object(state))
		{
			$scope.existingLocation.State = state.name;
			$scope.existingLocation.StateFIP = state.StateFIP;
			$scope.filter.existingCounties = Map.findAllCountiesByState(state);
		}
		else
		{
			$scope.existingLocation.State = "";
			$scope.existingLocation.StateFIP = "";			
			$scope.filter.existingCounties = [];
		}
	});
	  
	$scope.$watch('existingLocation.CountyObject', function() {
		var county = $scope.existingLocation.CountyObject;

		if (county === Object(county))
		{
			$scope.existingLocation.County = county.name;
			$scope.existingLocation.CountyFIP = county.CountyFIP;
		}
		else
		{
			$scope.existingLocation.County = "";
			$scope.existingLocation.CountyFIP = "";
		}
	});

	$scope.$watch('existingLocation.Facility', function() {
		var facility = $scope.existingLocation.Facility;

		if (facility === Object(facility))
		{
			var state = Map.findStateByAbbv(facility.State);
			$scope.existingLocation.StateObject = state;

			var county = Map.findCountyByNameAndState(facility.County, state);
			$scope.existingLocation.CountyObject = county;

			$scope.existingLocation.Address = facility.Address;
			$scope.existingLocation.City = facility.City;
			$scope.existingLocation.Zip = facility.Zip;
		}
	});

	var validator;
	$scope.validate = function(){
		if (validator === undefined)
		{
			validator = $('#bid-form').formValidation({
		        framework: 'bootstrap',
		        live: 'disabled',
		        icon: {
		            valid: 'fa fa-check-circle fa-lg text-success',
		            invalid: 'fa fa-times-circle fa-lg',
		            validating: 'fa fa-refresh'         
		        },
		        fields: {
		            agreeToTerms: {
		                validators: {
		                    notEmpty: {
		                        message: 'You must agree with the terms and conditions'
		                    }
		                }
		            },
		            name: {
						validators: {
							notEmpty: {
								message: 'You must enter a Name'
							}
						}
					},
					title: {
						validators: {
							notEmpty: {
								message: 'You must enter a Title'
							}
						}
					},
					company: {
						validators: {
							notEmpty: {
								message: 'You must enter a Company'
							}
						}
					},
					phoneNumber: {
						validators: {
							notEmpty: {
								message: 'You must enter a Phone Number'
							}
						}
					},
					email: {
						validators: {
							notEmpty: {
								message: 'You must enter an Email Address'
							}
						}
					},
					newAddress: {
						validators: {
							notEmpty: {
								message: 'You must enter an Address'
							}
						}
					},
					newCity: {
						validators: {
							notEmpty: {
								message: 'You must enter City'
							}
						}
					},
					newState: {
						validators: {
							notEmpty: {
								message: 'You must enter a State'
							}
						}
					},
					newZip: {
						validators: {
							notEmpty: {
								message: 'You must enter a Zip'
							}
						}
					},
					newCounty: {
						validators: {
							notEmpty: {
								message: 'You must enter a County'
							}
						}
					},
					existingAddress: {
						validators: {
							notEmpty: {
								message: 'You must enter an Email Address'
							}
						}
					}
		        }
		    });
		}
		validator.data('formValidation').validate();
		return validator.data('formValidation').isValid();
	}

	$scope.setLocation = function(){

		var type = $scope.location.Type;
		if (type === 'New Construction') {
			$scope.location =  $scope.newLocation;
		} else {
			$scope.location = $scope.existingLocation;
		}

		$scope.location.Type = type;

		$scope.$apply();
	}

	$scope.getCompanies = function (val) {

		return ClientContext.findCompanies(val).then(function (result) {
	 		if (result.isSuccess) {
	 			return result.data;
			}
	 	});;
	}
}]);