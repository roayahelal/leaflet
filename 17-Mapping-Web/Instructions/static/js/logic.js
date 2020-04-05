// Store our API endpoint inside queryUrl
const API_KEY = "pk.eyJ1Ijoicm9heWFoZWxhbCIsImEiOiJjazcxNHVoeWowMzR2M2dvM3FwbGtmbHBsIn0.Lh21KGXCygi5sBJJP_GGMg"

var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap]
});



function createFeatures(earthquakeData) {

    // Formatting the circle style, for the earthquake magnitude & colors
    function CircleLayer(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Color by magnitude, see: function CircleLayer
    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#ea2c2c";
            case magnitude > 4:
                return "#ea822c";
            case magnitude > 3:
                return "#ee9c00";
            case magnitude > 2:
                return "#eecc00";
            case magnitude > 1:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    }

    // Size by magnitude, see: function CircleLayer
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    function pointToLayer(feature, latlng) {
        return L.circleMarker(latlng);
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

    // Running leaflet geoJson function
    // Passing function to each attribute
    L.geoJson(earthquakeData, {
        pointToLayer: pointToLayer,
        style: CircleLayer,
        onEachFeature: onEachFeature,
    }).addTo(myMap);

    // Legend
    var legend = L.control({
        position: "bottomright"
    });

//     legend.onAdd = function() {
//         var div = L.DomUtil.create("div", "Legend");
//         var grades = [0, 1, 2, 3, 4, 5];
//         var colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

//         for (var i = 0; i < grades.length; i++) {
//             div.innerHTML +=
//                 "<i style='background: " + colors[i] + "'></i> " +
//                 grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
//         }
//         return div;
//     };
//     legend.addTo(myMap);
// }





// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});