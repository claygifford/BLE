angular.module('lbxApp')
.controller('listingsDetailController', ['$window', '$scope', '$stateParams', '$state', '$uibModal', 'ClientContext', 'ListingDetail', function ($window, $scope, $stateParams, $state, $uibModal, ClientContext, ListingDetail) {

	$scope.actions = {};
	$scope.listing = ListingDetail.Listing;
	$scope.bid = ListingDetail.Bid;
  	$scope.activities = [];
  	$scope.messages = [];


	$scope.getActivities = function() {
		var bid = $scope.bid;
		if (bid === undefined)
			return;

		$scope.actions.activityIsBusy = true;

		ClientContext.getActivitiesByBid(bid.Id).then(function (result) {
	 		$scope.actions.activityIsBusy = false;
	 		if (result.isSuccess) {
	 			$scope.activities = result.data;
			}
	 	});
	}

	$scope.getMessages = function() {
		var bid = $scope.bid;
		if (bid === undefined)
			return;

		$scope.actions.messageIsBusy = true;
		
		ClientContext.getMessagesByBid(bid.Id).then(function (result) {
	 		$scope.actions.messageIsBusy = false;
	 		if (result.isSuccess) {
	 			$scope.messages = result.data;
			}
	 	});
	}

	$scope.reloadData = function() {
      	var bid = $scope.bid;
		if (bid === undefined)
			return;

  		$scope.actions.bidsIsBusy = true;
		ClientContext.getBidById(bid.Id).then(function (result) {
	 		$scope.actions.bidsIsBusy = false;
	 		if (result.isSuccess) {
	 			$scope.bid = result.data;
			}
	 	});
		$scope.getActivities();		
		$scope.getMessages();
	}

	$scope.sellerCounter = function() {
		
		var bid = $scope.bid;

		var modalInstance = $uibModal.open({
	      	animation: false,
	      	templateUrl: 'src/views/actions/counter.html',
	      	controller: 'sellerCounterController',
	      	//size: 'lg',
	      	resolve: {
		    	bid: function () {
	        		return bid;
	       		}
      		}
		});

		modalInstance.result.then(function () {
			$scope.reloadData();
    	});
	}

	$scope.sellerReject = function() {
		
		var bid = $scope.bid;

		var modalInstance = $uibModal.open({
	      	animation: false,
	      	templateUrl: 'src/views/actions/reject.html',
	      	controller: 'sellerRejectController',
	      	//size: 'lg',
	      	resolve: {
		    	bid: function () {
	        		return bid;
	       		}
      		}
		});

		modalInstance.result.then(function () {
			$scope.reloadData();	
    	});
	}

	$scope.sellerAccept = function() {
		
		var bid = $scope.bid;

		var modalInstance = $uibModal.open({
	      	animation: false,
	      	templateUrl: 'src/views/actions/accept.html',
	      	controller: 'sellerAcceptController',
	      	//size: 'lg',
	      	resolve: {
		    	bid: function () {
	        		return bid;
	       		}
      		}
		});

		modalInstance.result.then(function () {
      		$scope.reloadData();		
    	});
	}

	$scope.sellerSendMessage = function() {
		
		var bid = $scope.bid;

		var modalInstance = $uibModal.open({
	      	animation: false,
	      	templateUrl: 'src/views/actions/sendMessage.html',
	      	controller: 'sellerSendMessageController',
	      	//size: 'lg',
	      	resolve: {
		    	bid: function () {
	        		return bid;
	       		}
      		}
		});

		modalInstance.result.then(function () {
      		$scope.reloadData();		
    	});
	}

	$scope.getStatusClass = function (bid) {
        return ClientContext.getStatusClass(bid);
	}

	$scope.back = function() {
		$state.go('app.profile.listings');
	}

	$scope.getActivities();
	$scope.getMessages();
}]);