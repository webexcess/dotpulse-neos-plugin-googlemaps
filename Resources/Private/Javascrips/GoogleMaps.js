// Google Maps Function
// To set the options, use the global variable GoogleMapsOptions
// To set the marker pin, use the global variable GoogleMapsPin
// To include functions, use GoogleMapsFunction
window.initDotpulseGoogleMaps = function() {
	// We store eveything in one Object, so it's easier to include function
	var object = {
		Map: {
			elements: document.querySelectorAll('.google-map'),
			options: {
				zoom              : 15,
				mapTypeControl    : true,
				streetViewControl : false,
				zoomControl       : true,
				scrollwheel       : false
			}
		},
		Streetview: {
			elements: document.querySelectorAll('.google-streetview'),
			options: {
				scrollwheel: false
			}
		}
	};
	var feedback = [];
	for (var key in object) {
		var num = object[key].elements.length;
		object[key].index = num;
		feedback[feedback.length] = num + ' ' + key + (num == 1 ? '' : 's') + ' found';
	}

	var extend = function(object, inject) {
		for (var key in inject) {
			if (inject.hasOwnProperty(key)) {
				object[key] = inject[key];
			}
		}
		return object;
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

	if (typeof GoogleMapsFunction === 'function') {
		GoogleMapsFunction();
	}

	if (typeof GoogleMapsOptions === 'object') {
		extend(object.Map.options, GoogleMapsOptions);
	}

	if (typeof GoogleStreetviewOptions === 'object') {
		extend(object.Streetview.options, GoogleStreetviewOptions);
	}

	for (var m = 0; m < object.Map.index; m++) {
		var map = object.Map.elements[m];
		if (map.className.indexOf('init') === -1) {
			map.className += ' init';

			var storage = {
				lat: getFloat(map,'lat'),
				lng: getFloat(map,'lng'),
				content : map.innerHTML
			};
			var mapOptions = object.Map.options;
			var zoom = getNumber(map,'zoom');

			storage.LatLng = new google.maps.LatLng(storage.lat, storage.lng);
			mapOptions.center = storage.LatLng;

			if (typeof zoom === 'number') {
				mapOptions.zoom = zoom;
			}

			storage.map = new google.maps.Map(map, mapOptions);

			if (storage.content) {
				storage.infowindow = new google.maps.InfoWindow({
					content: storage.content
				});
			}

			// Marker definieren
			var marker = {
				position: storage.LatLng,
				title : map.getAttribute('data-marker-title'),
				map: storage.map,
				draggable: false
			};

			if (typeof GoogleMapsPin === 'string') {
				marker.icon = GoogleMapsPin;
			} else if (typeof GoogleMapsPin === 'object') {
				extend(marker, GoogleMapsPin);
			}
			storage.marker = new google.maps.Marker(marker);

			if (hasData(map,'showinfo') && storage.content) {
				storage.infowindow.open(storage.map,storage.marker);
			}

			// jshint loopfunc:true
			if (typeof window.addEventListener === 'function') {
				(function(_storage) {
					google.maps.event.addListener(_storage.marker, 'click', function() {
						if (_storage.content) {
							_storage.infowindow.open(_storage.map, _storage.marker);
						} else {
							window.open('https://www.google.com/maps/dir//' + _storage.lat + ',' + _storage.lng);
						}
					});
				})(storage);
			}
			// jshint loopfunc:false
		}
	}

	for (var s = 0; s < object.Streetview.index; s++) {
		var streetview = object.Streetview.elements[s];
		if (streetview.className.indexOf('init') === -1) {
			streetview.className += ' init';
			var streetStorage = object.Streetview.options;
			streetStorage.position = new google.maps.LatLng(getFloat(streetview, 'lat'), getFloat(streetview, 'lng'));
			streetStorage.pov = {
				heading: getNumber(streetview, 'heading') || 0,
				pitch: getNumber(streetview, 'pitch') || 0
			};
			new google.maps.StreetViewPanorama(streetview, streetStorage);
		}
	}

	return feedback;
};
