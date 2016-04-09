class Map {
	constructor($rootScope, $http, $q, $state, ClientContext) {
		this.$rootScope = $rootScope;
		this.$q = $q;
		this.$http = $http;
		this.ClientContext = ClientContext;

		this._lookups = [];
		this._fipsStateCodes = null;
		this._fipsCountyCodes = null;		
		this._stateMap = null;
		this._us = null;
		this._states = [];
		this._counties = [];
		this._isMapLoaded = false;
	}

	get isMapLoaded() {
		return this._isMapLoaded;
	}

	get us() {
		return this._us;
	}

	get counties() {
		return this._counties;
	}

	get states() {
		return this._states;
	}

	get fipsStateCodes() {
		return this._fipsStateCodes;
	}

	get fipsCountyCodes() {
		return this._fipsCountyCodes;
	}

	get lookups() {
		return this._lookups;
	}

	set lookups(value) {
		this._lookups = value;
	}

	get stateMap() {
		return this._stateMap;
	}

	set stateMap(value) {

		var stateMap = [];
		value.forEach(function(i) {
	    	stateMap[i.id] = i;
	   	});
	   	this._stateMap = stateMap;
	}

	findState(d) {
		if (d)
			return this._fipsStateCodes[d.id];
		return undefined;
	}

	findStateName(d) {
		if (d) {
			var state = this._fipsStateCodes[d.id];
			if (state)
				return state.StateName;
		}
		return undefined;
	}

	findCounty(d) {
		if (d)
			return this._fipsCountyCodes[d.id];
		return undefined;
	}

	findCountyName(d) {
		if (d) {
			var county = this._fipsCountyCodes[d.id];
			if (county)
				return county.CountyName;
		}
		return undefined;
	}

	findAllCountiesByState(state) {
		if (state) {
			var counties = [];

			this._fipsCountyCodes.forEach(function(i) {

				if (i.StateFIP === state.StateFIP)
					counties.push(i);
		   	});

			return counties;		
		}
		return undefined;
	}

	findStateByAbbv(name) {
		if (name) {
			for (var i in this._fipsStateCodes) {
				var state = this._fipsStateCodes[i];
				if (state.StateAbbv === name)
					return state;
			}
		}
		return undefined;
	}

	findCountyByNameAndState(name, state) {
		var counties = this.findAllCountiesByState(state);
		if (name) {
			for (var i in counties) {
				var county = counties[i];
				if (county.name.indexOf(name) === 0)
					return county;
			}
		}
		return undefined;		
	}	

	pad(n, width, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	get map() {
		var deferred = this.$q.defer();
		var that = this;
		var promises = [];

		if (this._us === null) {
			promises.push(this.ClientContext.data('data/us.json').then(function (result)
			{
				if (result.isSuccess)
					that._us = result.data;
			}));
		}

		if (this._fipsStateCodes === null) {
			promises.push(this.ClientContext.data('data/FipsStateCodes.json').then(function (result)
			{
				if (result.isSuccess) {
					that._fipsStateCodes = [];
					that._states = [];
					result.data.forEach(function(i) {
						i.id = "S" + i.StateFIP;
						i.isState = true;
						i.name = i.StateName;
				    	that._fipsStateCodes[i.StateFIP] = i;

				    	that._states.push(i);
				   	});
				}
			}));
		}

		if (this._fipsCountyCodes === null) {
			promises.push(this.ClientContext.data('data/FipsCountyCodes.json').then(function (result)
			{
				if (result.isSuccess)
				{
					that._fipsCountyCodes = [];
					that._counties = [];
					result.data.forEach(function(i) {
						i.id = "S" + i.StateFIP + "C" + i.CountyFIP;
						i.CountyId = that.pad(i.CountyFIP, 3);
						i.isCounty = true;
						i.name = i.CountyName;
			      		that._fipsCountyCodes["" + i.StateFIP + that.pad(i.CountyFIP, 3)] = i;

			      		that._counties.push(i);
				   	});
				}
			}));		
		}

		if (promises.length === 0) {
			deferred.resolve(that._us, that._fipsStateCodes, that._fipsCountyCodes);
		} else {
			this.$q.all(promises).then(function(result) {
				var items = [];

				that._fipsCountyCodes.forEach(function(i) {
					items.push(i);
			   	});

				that._fipsStateCodes.forEach(function(i) {
					items.push(i);
			   	});			   	

				that.stateMap = topojson.feature(that._us, that._us.objects.states).features;
				that.lookups = items;
				deferred.resolve(that._us, that._fipsStateCodes, that._fipsCountyCodes);
				
				that._isMapLoaded = true;
				that.$rootScope.$broadcast('mapLoaded'); 
			});
		}

		return deferred.promise;
	}
}

Map.$inject = ['$rootScope', '$http', '$q', '$state', 'ClientContext'];

angular.module('lbxApp').service('Map', Map);