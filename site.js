// http://ejohn.org/apps/jselect/event.html
function addEvent(object, event, method) {
    if (object.attachEvent) {
        object['e' + event + method] = method;
        object[event + method] = function(){object['e' + event + method](window.event);};
        object.attachEvent('on' + event, object[event + method]);
    } else {
    object.addEventListener(event, method, false);
    }
}

!(function(context) {
    var Tristen = function() {};

    Tristen.prototype = {
        masthead: function() {
            var m = document.getElementById('masthead');
            addEvent(document.getElementById('t-toggle'), 'click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              m.className !== 'active' ? m.className = 'active' : m.className = '';
            });
        },
        frontpage: function() {
            var poi =[
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [-77.03238901390978,38.913188059745586]
                },
                "properties": {
                  "title": "MapBox",
                  "description": "Description"
                }
              },
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [-77.02994832073742,38.93300783632215]
                },
                "properties": {
                  "title": "Home in Columbia Heights",
                  "description": "Description"
                }
              },
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [-79.44889783859253,43.64828784884155]
                },
                "properties": {
                  "title": "Toronto",
                  "description": "Description"
                }
              },
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [-123.43264160339346,48.46711840348592]
                },
                "properties": {
                  "title": "Born",
                  "description": "Description"
                }
              },
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [-124.44211358934785,49.3556511909281]
                },
                "properties": {
                  "title": "Raised",
                  "description": "Description"
                }
              }
            ];

            // Create map
            var map = mapbox.map('map');
            map.addLayer(mapbox.layer().id('tristen.homepage'));

            // Create and add marker layer
            var markerLayer = mapbox.markers.layer().features(poi);
            var interaction = mapbox.markers.interaction(markerLayer);
            map.addLayer(markerLayer);

            // Set a custom formatter for tooltips
            // Provide a function that returns html to be used in tooltip
            interaction.formatter(function(feature) {
                var o = '<a target="_blank" href="' + feature.properties.url + '">' +
                    '<img src="' + feature.properties.image + '">' +
                    '<h2>' + feature.properties.city + '</h2>' +
                    '</a>';

                return o;
            });

            map.ui.zoomer.add();
            map.setZoomRange(2, 5);

            // Set iniital center and zoom
            map.centerzoom({
                lat: 43.7,
                lon: 12.5
            }, 2);
        }
    }

    window.Tristen = Tristen;
})(window);
