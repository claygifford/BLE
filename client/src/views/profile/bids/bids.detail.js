angular.module('lbxApp')
.controller('bidsDetailController', ['$window', '$scope', '$stateParams', '$state', '$uibModal', 'ClientContext', 'BidDetail', function ($window, $scope, $stateParams, $state, $uibModal, ClientContext, BidDetail) {

	$scope.actions = {};
	$scope.bid = BidDetail.Bid;			
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

	$scope.buyerCounter = function() {
		
		var bid = $scope.bid;

		var modalInstance = $uibModal.open({
	      	animation: false,
	      	templateUrl: 'src/views/actions/buyerCounter.html',
	      	controller: 'buyerCounterController',
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

	$scope.buyerReject = function() {
		
		var bid = $scope.bid;

		var modalInstance = $uibModal.open({
	      	animation: false,
	      	templateUrl: 'src/views/actions/reject.html',
	      	controller: 'buyerRejectController',
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

	$scope.buyerAccept = function() {
		
		var bid = $scope.bid;

		var modalInstance = $uibModal.open({
	      	animation: false,
	      	templateUrl: 'src/views/actions/accept.html',
	      	controller: 'buyerAcceptController',
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

	$scope.buyerSendMessage = function() {
		
		var bid = $scope.bid;

		var modalInstance = $uibModal.open({
	      	animation: false,
	      	templateUrl: 'src/views/actions/sendMessage.html',
	      	controller: 'buyerSendMessageController',
	      	//size: 'lg',
	      	resolve: {
		    	bid: function () {
	        		return bid;
	       		}
      		}
		});

		modalInstance.result.then(function () {
      		
			//
      		$scope.reloadData();		
    	});
	}

	$scope.getStatusClass = function (bid) {
		return ClientContext.getStatusClass(bid);
	}

	$scope.back = function() {
		$state.go('app.profile.bids');
	}

	$scope.getActivities();
	$scope.getMessages();
}]);