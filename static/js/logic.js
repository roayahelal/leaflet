// Store our API endpoint inside queryUrl

var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-12-31&endtime=" +
  "2020-01-01&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});
var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap,darkmap]
});

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});


function createFeatures(earthquakeData) {

    // Formatting the circle style, for the earthquake magnitude & colors
    function CircleLayer(feature) {
        return {
            opacity: 0.5,
            fillOpacity: 0.9,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: feature.properties.mag*7,
            stroke: true,
            weight: 0.5
        };
    }

    // Color by magnitude, see: function CircleLayer
    function getColor(x) {
        switch (true) {
            case x > 5:
                return "red";
            case x > 4:
                return "purple";
            case x > 3:
                return "yellow";
            case x > 2:
                return "blue";
            case x > 1:
                return "pink";
            default:
                return "#98ee00";
        }
    }

    function pointToLayer(feature, latlng) {
        return L.circleMarker(latlng);
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

    // Running leaflet geoJson function
    // Passing the associated function to each attribute
    var earthquakes = L.geoJson(earthquakeData, {
        pointToLayer: pointToLayer,
        style: CircleLayer,
        onEachFeature: onEachFeature,
    }).addTo(myMap);
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
      };
    var overlayMaps = {
        Earthquakes: earthquakes
      };
    L.control.layers(baseMaps
        , overlayMaps
        , {
        collapsed: false}
        ).addTo(myMap);
    
    L.control({ position: "bottomright" }).addTo(myMap);




}

