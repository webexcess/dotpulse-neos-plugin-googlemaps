// jscs: disable
// jshint ignore:start
window.initMaps=function(){var e=document.querySelectorAll(".google-map"),o=document.querySelectorAll(".google-streetview"),t=o.length,n=e.length,a=n+" Google Map"+(1!==n?"s":"")+" found.",i=function(e,o){for(var t in o)o.hasOwnProperty(t)&&(e[t]=o[t]);return e},r=function(e,o){return parseFloat(e.getAttribute("data-"+o))},l=function(e,o){return parseInt(e.getAttribute("data-"+o))},g=function(e,o){return null!==e.getAttribute("data-"+o)},p={zoom:15,mapTypeControl:!0,streetViewControl:!1,zoomControl:!0,scrollwheel:!1},s={scrollwheel:!1};"function"==typeof GoogleMapsFunction&&GoogleMapsFunction(),"object"==typeof GoogleMapsOptions&&i(p,GoogleMapsOptions),"object"==typeof GoogleStreetviewOptions&&i(s,GoogleStreetviewOptions);for(var c=0;n>c;c++){var m=e[c];if(-1===m.className.indexOf("init")){m.className+=" init";var w={lat:r(m,"lat"),lng:r(m,"lng"),content:m.innerHTML},d=l(m,"zoom");"number"==typeof d&&(p.zoom=d),w.LatLng=new google.maps.LatLng(w.lat,w.lng),p.center=w.LatLng,w.map=new google.maps.Map(m,p),w.content&&(w.infowindow=new google.maps.InfoWindow({content:w.content}));var f={position:w.LatLng,title:m.getAttribute("data-marker-title"),map:w.map,draggable:!1};"string"==typeof GoogleMapsPin?f.icon=GoogleMapsPin:"object"==typeof GoogleMapsPin&&i(f,GoogleMapsPin),w.marker=new google.maps.Marker(f),g(m,"showinfo")&&w.content&&w.infowindow.open(w.map,w.marker),"function"==typeof window.addEventListener&&!function(e){google.maps.event.addListener(e.marker,"click",function(){e.content?e.infowindow.open(e.map,e.marker):window.open("https://www.google.com/maps/dir//"+e.lat+","+e.lng)})}(w)}}for(var u=0;t>u;u++){var v=o[u];if(-1===v.className.indexOf("init")){v.className+=" init";var L=s;L.position=new google.maps.LatLng(r(v,"lat"),r(v,"lng")),L.pov={heading:l(v,"heading")||0,pitch:l(v,"pitch")||0},new google.maps.StreetViewPanorama(v,L)}}return a},document.addEventListener("Neos.PageLoaded",initMaps,!1);
