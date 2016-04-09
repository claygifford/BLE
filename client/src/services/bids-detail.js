class BidDetail {
	constructor($localStorage) {
		this.$storage = $localStorage.$default({ bidDetailBid: undefined });
	}
	get Bid() {
		return this.$storage.bidDetailBid;
	}

	set Bid(value) {
		this.$storage.bidDetailBid = value;
	}
}

BidDetail.$inject = ['$localStorage'];

angular.module('lbxApp').service('BidDetail', BidDetail);