angular.module('lbxApp')
.controller('listingsController', ['$window', '$scope', '$stateParams', '$state', 'ClientContext', 'ListingDetail', '$uibModal', function ($window, $scope, $stateParams, $state, ClientContext, ListingDetail, $uibModal) {

	$scope.actions = {};
  	$scope.listings = [];

  	$scope.loadData = function() {
  		$scope.actions.isBusy = true;

		ClientContext.getUserListings().then(function (result) {
			$scope.actions.isBusy = false;
			if (result.isSuccess) {
				$scope.listings = result.data;
			}
		});
	};

	$scope.listingDetails = function(listing, bid) {
		ListingDetail.Listing = listing;
		ListingDetail.Bid = bid;
		$state.go('app.profile.listings.detail');
	}

	$scope.getStatusClass = function (bid) {
        return ClientContext.getStatusClass(bid);
	}

	$scope.retractListing = function(listing) {
		
		var modalInstance = $uibModal.open({
	      	animation: false,
	      	templateUrl: 'src/views/actions/retractListing.html',
	      	controller: 'retractListingController',
	      	//size: 'lg',
	      	resolve: {
		    	listing: function () {
	        		return listing;
	       		}
      		}
		});

		modalInstance.result.then(function () {
			$scope.loadData();
    	});
	}

	$scope.loadData();

}]);