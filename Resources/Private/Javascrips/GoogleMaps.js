// Google Maps Function
// To set the options, use the global variable GoogleMapsOptions
// To set the marker pin, use the global variable  GoogleMapsPin
// To include functions, use GoogleMapsFunction
window.initMaps = function() {

	var elements = document.querySelectorAll('.google-map');
	var streetviews = document.querySelectorAll('.google-streetview');
	var streetIndex = streetviews.length;
	var index    = elements.length;
	var msg      = index + ' Google Map' + (index !== 1 ? 's' : '') + ' found.';

	var extend = function(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	};

	var getFloat = function(element, value) {
		return parseFloat(element.getAttribute('data-' + value));
	};

	var getNumber = function(element, value) {
		return parseInt(element.getAttribute('data-' + value));
	};

	var hasData = function(element, value) {
		return element.getAttribute('data-' + value) !== null;
	};

	// Default Optionen
	var options = {
		zoom              : 15,
		mapTypeControl    : true,
		streetViewControl : false,
		zoomControl       : true,
		scrollwheel       : false
	};

	var streetviewOptions = {
		scrollwheel: false
	};

	if (typeof GoogleMapsFunction === 'function') {
		GoogleMapsFunction();
	}

	if (typeof GoogleMapsOptions === 'object') {
		extend(options, GoogleMapsOptions);
	}

	if (typeof GoogleStreetviewOptions === 'object') {
		extend(streetviewOptions, GoogleStreetviewOptions);
	}

	for (var i = 0; i < index; i++) {
		var element = elements[i];
		if (element.className.indexOf('init') === -1) {
			element.className += ' init';
			var storage = {
				lat: getFloat(element,'lat'),
				lng: getFloat(element,'lng'),
				content : element.innerHTML
			};
			var zoom = getNumber(element,'zoom');
			if (typeof zoom === 'number') {
				options.zoom = zoom;
			}
			storage.LatLng =  new google.maps.LatLng(storage.lat,storage.lng);
			options.center = storage.LatLng;
			storage.map = new google.maps.Map(element,options);
			if (storage.content) {
				storage.infowindow = new google.maps.InfoWindow({
					content: storage.content
				});
			}

			// Marker definieren
			var marker = {
				position: storage.LatLng,
				title : element.getAttribute('data-marker-title'),
				map: storage.map,
				draggable: false
			};

			if (typeof GoogleMapsPin === 'string') {
				marker.icon = GoogleMapsPin;
			} else if (typeof GoogleMapsPin === 'object') {
				extend(marker, GoogleMapsPin);
			}
			storage.marker = new google.maps.Marker(marker);

			if (hasData(element,'showinfo') && storage.content) {
				storage.infowindow.open(storage.map,storage.marker);
			}

			/* jshint loopfunc:true */
			if (typeof window.addEventListener === 'function') {
				(function(_storage) {
					google.maps.event.addListener(_storage.marker, 'click', function() {
						if (_storage.content) {
							_storage.infowindow.open(_storage.map,_storage.marker);
						} else {
							window.open('https://www.google.com/maps/dir//' + _storage.lat + ',' + _storage.lng);
						}
					});
				})(storage);
			}
			/* jshint loopfunc:false */
		}
	}

	for (var s = 0; s < streetIndex; s++) {
		var streetview = streetviews[s];
		if (streetview.className.indexOf('init') === -1) {
			streetview.className += ' init';
			var streetStorage = streetviewOptions;
			streetStorage.position = new google.maps.LatLng(getFloat(streetview, 'lat'), getFloat(streetview, 'lng'));
			streetStorage.pov = {
				heading: getNumber(streetview, 'heading') || 0,
				pitch: getNumber(streetview, 'pitch') || 0
			};

			new google.maps.StreetViewPanorama(streetview, streetStorage);
		}
	}

	return msg;
};

document.addEventListener('Neos.PageLoaded',initMaps, false);
