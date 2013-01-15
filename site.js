---
---
;{% include js/dragdealer.min.js %}
;{% include js/hoverintent.min.js %}

var addEvent = function(object, event, method) {
    if (object.attachEvent) {
        object['e' + event + method] = method;
        object[event + method] = function(){object['e' + event + method](window.event);};
        object.attachEvent('on' + event, object[event + method]);
    } else {
    object.addEventListener(event, method, false);
    }
}

var cancel = function(event) {
    (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
    (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
}

!(function(context) {
    var Tristen = function() {};
    Tristen.prototype = {
        projects: [
            {
                "name": "Forsythe Sans",
                "url": "http://tristen.ca/forsythe/",
                "description": "A tall open type font."
            },
            {
                "name": "tablesort",
                "url": "http://tristen.ca/tablesort/demo/",
                "description": "Dependency free sorting component for tables."
            },
            {
                "name": "HCL Picker",
                "url": "http://tristen.ca/hcl-picker/#/hlc/6/1/20313E/EFEE68",
                "description": "A hue, chroma, lightness color picker."
            },
            {
                "name": "Superman",
                "url": "https://github.com/tristen/superman",
                "description": "A dark vim theme."
            }
        ],
        _cancel: function(event) {
            (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
            (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
        },

        masthead: function() {
            var that = this;
            var m = document.getElementById('masthead');
            var p = document.getElementById('tristen-projects');
            addEvent(document.getElementById('t-toggle'), 'click', function(e) {
                that._cancel(e);
                m.className = 'active';
            });

            var options = {
                timeout:500
            }

            var mastheadHover = hoverintent(m, function() {
                // nothing.
            }, function(e) {
                this.className = '';
            }).options(options);

            for (var i = 0; i < this.projects.length; i++) {
                var li = document.createElement('li');
                li.innerHTML = '<a href="' + this.projects[i].url + '">' + this.projects[i].name + '</a>' +
                '<p>' + this.projects[i].description + '</p>';
                p.appendChild(li);
            }
        },
        frontpage: function() {
            var poi =[
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [-77.03238901390978,38.913188059745586]
                },
                "properties": {
                  "klass":4,
                  "dates": "2011 - present",
                  "title": "MapBox",
                  "description": "Got a job at DevelopmentSeed / MapBox. I presently live between here and Toronto."
                }
              },
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [-79.44889783859253,43.64828784884155]
                },
                "properties": {
                  "klass":3,
                  "dates": "2000 - present",
                  "title": "Toronto",
                  "description": "Completed a BMus at the University of Toronto. Realized I didn't want to be a jazz musician. Became interested in web design and development."
                }
              },
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [-124.44211358934785,49.3556511909281]
                },
                "properties": {
                  "klass":2,
                  "dates": "1991 - 2000",
                  "title": "Qualicum Beach",
                  "description": "Attended Qualicum Beach Middle and Kwalikum High school. Wanted to be a jazz musician."
                }
              },
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [-123.43264160339346,48.46711840348592]
                },
                "properties": {
                  "klass":1,
                  "dates": "1981 - 1991",
                  "title": "Victoria",
                  "description": "Born in Victoria General. Attended Wishart Elementary School and lived in Colwood."
                }
              }
            ];

            // Create map
            var map = mapbox.map('map');
            map.addLayer(mapbox.layer().id('tristen.homepage'));

            // Create and add marker layer
            var markerLayer = mapbox.markers.layer().features(poi).factory(function(f) {
                var p = document.createElement('div');
                p.className = 'marker marker-' + f.properties.klass;
                p.innerHTML = f.properties.klass;

                var up = document.createElement('div');
                    up.className = 'm-popup';
                    up.innerHTML = '<span class="date">' + f.properties.dates + '</span>' +
                            '<h3>' + f.properties.title + '</h3>' +
                            '<p>' + f.properties.description + '</p>';

                    p.appendChild(up);

                    // Center marker on click
                    MM.addEvent(p, 'click', function(e) {
                        var pos = MM.getMousePoint(e, map);
                        var l = map.pointLocation(pos);
                        $('#map').find('.active').removeClass('active');
                        p.className += ' active';
                        map.ease.location({
                            lat: (l.lat) + 1,
                            lon: (l.lon) + 1
                        }).zoom(5).optimal();
                    });

                return p;
            });
            map.addLayer(markerLayer);
            map.setZoomRange(2, 5);

            // Set iniital center and zoom
            map.centerzoom({
                lat: 56.25,
                lon: -57.35
            }, 3);
        }
    }

    window.Tristen = Tristen;
})(window);
