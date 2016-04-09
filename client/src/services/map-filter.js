class MapFilter {
	constructor() {
		this._selections = null;
		this._listings = [];
	 	this._selectedLocations = {};
	 	this._selectedLocations.items = [];


	 	this._realEstate = [];

	 	this._realEstate.push(
	 	{
	 		label: 'Bed Licenses without Real Estate',
	 		isChecked: true
	 	});

	 	this._realEstate.push(
	 	{
	 		label: 'Bed Licenses with Real Estate',
	 		isChecked: true
	 	});

	 	this._pricePerBed = {
	 		Min : '',
	 		Max : ''
	 	};
	}

	get selections() {
		return this._selections;
	}

	set selections(value) {		
		this._selections = value;
	}

	get realEstateFilter() {
		var withLicense = this._realEstate[0].isChecked;
		var withoutLicense = this._realEstate[1].isChecked;

		if (withLicense && withoutLicense)
			return 0;

		if (withLicense)
			return 1;

		if (withoutLicense)
			return 2;

		return 3;
	}

	get realEstate() {
		return this._realEstate;
	}

	get pricePerBed() {
		return this._pricePerBed;
	}

	get listings() {
		return this._listings;
	}

	set listings(value) {		
		this._listings = value;
	}

	get selectedLocations() {
		return this._selectedLocations;
	}

	set selectedLocations(value) {		
		this._selectedLocations = value;
	}
}

angular.module('lbxApp').service('MapFilter', MapFilter);