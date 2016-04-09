class ClientContext {
	constructor($http, $q, $state, $localStorage, MapFilter) {
		this.$q = $q;
		this.$http = $http;
		this.$state = $state;
		this.$storage = $localStorage.$default({ appInstanceId: undefined });

		//this._baseUrl = '';
		this._baseUrl = 'http://localhost:3456';

		this._currentState = null;
		this._isLoggedIn = false;
		this._filter = MapFilter;
		this._appInstance = null;
	}

	addAuthHeader(headers) {
		if (this.$storage.appInstanceId === undefined)
			return headers;

		headers['Ble-Session'] = this.$storage.appInstanceId;
		return headers;
	}

	data(url) {
		//url = this._baseUrl + url;

		var deferred = this.$q.defer();

		var headers = {
			'accept': 'application/json, text/plain, */*',
			'cache-control': 'no-cache',
			'pragma': 'no-cache'
		};

		//headers = this.addAuthHeader(headers);

		this.$http({ method: 'get', url: url, headers: headers, withCredentials: true, cache: false })
			.success(function(data, status, responseHeaders, config) {
				deferred.resolve({ isSuccess: true, data: data });
			}).error(function(data) {
				deferred.resolve({ isSuccess: false, data: data });
			});

		return deferred.promise;
	}

	get(url, queryParams) {		
		url = this._baseUrl + url;
		
		var deferred = this.$q.defer();

		var headers = {
			'accept': 'application/json, text/plain, */*',
			'cache-control': 'no-cache',
			'pragma': 'no-cache'
		};

		headers = this.addAuthHeader(headers);

		if (queryParams != '' && queryParams != undefined) {
			url = url + '?' +queryParams;
		}

		this.$http({ method: 'get', url: url, headers: headers, withCredentials: true, cache: false })
			.success(function(data, status, responseHeaders, config) {
				deferred.resolve({ isSuccess: true, data: data });
			}).error(function(data) {
				deferred.resolve({ isSuccess: false, data: data });
			});

		return deferred.promise;
	}
  
	post(url, queryParams, body) {
		url = this.baseUrl + url;

		var deferred = this.$q.defer();

		var headers = {
			'Accept': 'application/json, text/plain, */*'
		};

		headers = this.addAuthHeader(headers);

		if (queryParams != '' && queryParams != undefined) {
			url = url + '?' + queryParams;
		}

		this.$http({ method: 'post', url: url, headers: headers, data: body, withCredentials: true })
			.success(function(data, status) {
				deferred.resolve({ isSuccess: true, data: data });
			}).error(function(data, status) {
				deferred.resolve({ isSuccess: false, status: status, data: data });
			});

		return deferred.promise;
	}

	put(url, queryParams, body) {
		url = this.baseUrl + url;
  	
		var deferred = this.$q.defer();

		var headers = {
			'Accept': 'application/json, text/plain, */*'
		};

		headers = this.addAuthHeader(headers);

		if (queryParams != '' && queryParams != undefined) {
			url = url + '?' +queryParams;
		}


		this.$http({ method: 'put', url: url, headers: headers, data: body, withCredentials: true })
			.success(function(data, status) {
				deferred.resolve({ isSuccess: true, data: data});
			}).error(function(data, status) {
				deferred.resolve({ isSuccess: false, status: status });
			});

		return deferred.promise;	
	}
  
	delete(url, queryParams) {
		url = this.baseUrl + url;
  	
		var deferred = this.$q.defer();

		var headers = {
			'Accept': 'application/json, text/plain, */*'
		};

		headers = this.addAuthHeader(headers);

		if (queryParams != '' && queryParams != undefined) {
			url = url + '?' +queryParams;
		}


		this.$http({ method: 'delete', url: url, headers: headers, withCredentials: true })
			.success(function(data, status) {				
				deferred.resolve({ isSuccess: true, data: data });
			}).error(function(data, status) {
				deferred.resolve({ isSuccess: false, status: status, data: data });
			});

		return deferred.promise;	
	}

	get AppInstance() {
		return this._appInstance;
	}

	set AppInstance(value) {
		this._appInstance = value;
	}

	get AppUser() {
		return this._appUser;
	}

	set AppUser(value) {
		this._appUser = value;
	}

	get Stats() {
		return this._stats;
	}

	set Stats(value) {
		this._stats = value;
	}

	get baseUrl() {
		return this._baseUrl;
	}

	get isLoggedIn() {
		return this._isLoggedIn;
	}

	set isLoggedIn(value) {
		this._isLoggedIn = value;
	}

	get currentState() {
		return this._currentState;
	}

	set currentState(value) {
		this._currentState = value;
	}

	get filter() {
		return this._filter;
	}

	set filter(value) {
		this._filter = value;
	}

	resetPassword(account) {
		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Authentication/ResetPassword', null, account).then(function (result) {
			if (result.isSuccess && result.data.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	signUp(appUser) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Authentication/CreateUser', null, appUser).then(function (result) {
			if (result.isSuccess && result.data.isSuccess) {
				that.$storage.appInstanceId = result.data.AppUser.AppInstanceId;
				that.AppInstanceId = result.data.AppInstance;				
				that.isLoggedIn = true;
				that.AppUser = result.data.AppUser;
				deferred.resolve({ isSuccess: result.isSuccess });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	signIn(account) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Authentication/Login', null, account).then(function (result) {
			if (result.isSuccess && result.data.isSuccess) {
				that.$storage.appInstanceId = result.data.AppUser.AppInstanceId;
				that.AppInstanceId = result.data.AppInstance;
				that.isLoggedIn = true;				
				that.AppUser = result.data.AppUser;
				that.getUserStats();
				deferred.resolve({ isSuccess: result.isSuccess });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	initialize() {
		var deferred = this.$q.defer();
		var that = this;

		if (this.$storage.appInstanceId) {
		  	this.post('/api/Authentication/GetUser', null, null).then(function (result) {
				if (result.isSuccess && result.data.isSuccess) {
					that.AppInstanceId = result.data.AppInstance;
					that.isLoggedIn = true;				
					that.AppUser = result.data.AppUser;
					that.getUserStats();
					deferred.resolve({ isSuccess: result.isSuccess });
				} else {				
					deferred.resolve({ isSuccess: false, data: result.data });				
				}			
			});
		} else {
			deferred.resolve({ isSuccess: false });
		}
		return deferred.promise;
	}

	signOut() {
		this._isLoggedIn = false;
		this.$storage.$reset();
		this.$state.go('app.home');
	}

	goToCurrentState() {
		if (this.currentState === null) {
			this.$state.go('app.home');
		} else {
			this.$state.go(this.currentState);
		}
	}

	updateAppUser(appUser) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Authentication/UpdateUser', null, appUser).then(function (result) {
			if (result.isSuccess && result.data.isSuccess) {
				that.AppUser = result.data.AppUser;
				deferred.resolve({ isSuccess: result.isSuccess });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	createListing(listing) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Listing/CreateListing', null, listing).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {
				deferred.resolve({ isSuccess: false, data: result.data });				
			}
		});
  		return deferred.promise;
	}

	getUserListings() {

		var deferred = this.$q.defer();
		var that = this;

		this.get('/api/Listing/GetUserListings', null).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	createBid(bid) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Bids/CreateBid', null, bid).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	getUserBids() {

		var deferred = this.$q.defer();
		var that = this;

		this.get('/api/Bids/GetUserBids', null).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	getBidById(id) {

		var deferred = this.$q.defer();
		var that = this;

		this.get('/api/Bids/GetBidById', 'id=' + id ).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	getBidsByListingId(id) {

		var deferred = this.$q.defer();
		var that = this;

		this.get('/api/Bids/GetBidsByListingId', 'id=' + id ).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	getListings(filter) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Listing/GetListings', null, filter).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	getUserStats() {

		if (this._isLoggedIn == false) {
			return;
		}

		var deferred = this.$q.defer();
		var that = this;

		this.get('/api/Stats/GetStats', null).then(function (result) {
			if (result.isSuccess) {
				that.Stats = result.data;
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}
		});
  		return deferred.promise;
	}

	getSettings() {

		var deferred = this.$q.defer();
		var that = this;

		this.get('/api/Authentication/GetSettings', null).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	updateSettings(settings) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Authentication/UpdateSettings', null, settings).then(function (result) {
			if (result.isSuccess && result.data.isSuccess) {				
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	getActivitiesByBid(id) {

		var deferred = this.$q.defer();
		var that = this;

		this.get('/api/Activities/GetActivitiesByBid', 'id=' + id ).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	getMessagesByBid(id) {

		var deferred = this.$q.defer();
		var that = this;

		this.get('/api/Messages/GetMessagesByBid', 'id=' + id ).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}
	
	sellerCounterBid(counter) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Bids/SellerCounterBid', null, counter).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	buyerCounterBid(counter) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Bids/BuyerCounterBid', null, counter).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	sellerRejectBid(id) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Bids/SellerRejectBid', 'id=' + id, null).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	buyerRejectBid(id) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Bids/BuyerRejectBid', 'id=' + id, null).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	sellerAcceptBid(id) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Bids/SellerAcceptBid', 'id=' + id, null).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	buyerAcceptBid(id) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Bids/BuyerAcceptBid', 'id=' + id, null).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	retractListing(id) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Listing/RetractListing', 'id=' + id, null).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	retractBid(id) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Bids/RetractBid', 'id=' + id, null).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	createMessage(message) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Messages/CreateMessage', null, message).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	findCompanies(filter) {

		var deferred = this.$q.defer();
		var that = this;

		this.get('/api/Company/FindCompanies', 'filter=' + filter).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	requestInformation(request) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Bids/RequestInformation', null, request).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	saveSearch(request) {

		var deferred = this.$q.defer();
		var that = this;

		this.post('/api/Search/CreateSearch', null, request).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	getSearches(request) {

		var deferred = this.$q.defer();
		var that = this;

		this.get('/api/Search/GetSearches', null).then(function (result) {
			if (result.isSuccess) {
				deferred.resolve({ isSuccess: result.isSuccess, data: result.data });
			} else {				
				deferred.resolve({ isSuccess: false, data: result.data });				
			}			
		});
  		return deferred.promise;
	}

	getStatusClass(bid) {

        switch (bid.BuyerStatus)
        {
            case "Need to Review": return "label-warning";
            case "Under Review": return "label-warning";
            case "Rejected": return "label-danger";
            case "Awarded": return "label-success";
            case "Counter Accepted": return "label-success";
            case "Retracted": return "label-dark";
            case "Expired": return "label-info";
            case "Request Information": return "label-purple";
        }
		return "";
	}
}

ClientContext.$inject = ['$http', '$q', '$state', '$localStorage','MapFilter'];

angular.module('lbxApp').service('ClientContext', ClientContext);