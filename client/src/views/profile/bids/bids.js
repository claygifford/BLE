angular.module('lbxApp')
.controller('bidsController', ['$window', '$scope', '$stateParams', '$state', '$uibModal', 'ClientContext', 'BidDetail', function ($window, $scope, $stateParams, $state, $uibModal, ClientContext, BidDetail) {

	  
	$scope.actions = {};
  	$scope.bids = [];

  	$scope.loadData = function() {
  		$scope.actions.isBusy = true;

		ClientContext.getUserBids().then(function (result) {
			$scope.actions.isBusy = false;
			if (result.isSuccess) {
				$scope.bids = result.data;
			}
		});
	};

	$scope.bidDetails = function(bid) {
		BidDetail.Bid = bid;
		$state.go('app.profile.bids.detail');
	}

	$scope.getStatusClass = function (bid) {
		return ClientContext.getStatusClass(bid);
	}

	$scope.retractBid = function(bid) {
		
		var modalInstance = $uibModal.open({
	      	animation: false,
	      	templateUrl: 'src/views/actions/retractBid.html',
	      	controller: 'retractBidController',
	      	//size: 'lg',
	      	resolve: {
		    	bid: function () {
	        		return bid;
	       		}
      		}
		});

		modalInstance.result.then(function () {
			$scope.loadData();
    	});
	}

	$scope.loadData();

}]);