class ListingDetail {
	constructor($localStorage) {
		this.$storage = $localStorage.$default({ listingDetailListing: undefined, listingDetailBid: undefined });
	}
	
	get Listing() {
		return this.$storage.listingDetailListing;
	}

	set Listing(value) {
		this.$storage.listingDetailListing = value;
	}

	get Bid() {
		return this.$storage.listingDetailBid;
	}

	set Bid(value) {
		this.$storage.listingDetailBid = value;
	}	
}

ListingDetail.$inject = ['$localStorage'];

angular.module('lbxApp').service('ListingDetail', ListingDetail);