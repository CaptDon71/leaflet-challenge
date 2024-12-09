// Store GEOJSON API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
    // Extract bounding box values to determine the depth range
    let bbox = data.bbox;  // [minLon, minLat, minDepth, maxLon, maxLat, maxDepth]
    let minDepth = bbox[2];
    let maxDepth = bbox[5];

    // Pass the features to a createFeatures() function:
    createFeatures(data.features, minDepth, maxDepth);
});

function createFeatures(earthquakeData, minDepth, maxDepth) {

    // Create a function to determine the color based on the depth of the earthquake
    function getColor(depth) {
        if (depth <= 10) return "#66FF33";  // Shallow (green)
        else if (depth <= 30) return "#cadb2b";  // Moderate (yellow)
        else if (depth <= 50) return "#FF6600";  // Deep (orange)
        else return "#FF0000";  // Very Deep (red)
    }

    // Create a function to scale the size of the circles based on the magnitude
    function getRadius(magnitude) {
        return magnitude * 4;  // Adjust multiplier to make the circles more or less pronounced
    }

    // Save the earthquake data in a variable.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`)
    }

    // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            // Create circle markers with size based on magnitude and color based on depth
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000000",  // Outline color
                weight: 0.5,         // Outline thickness
                opacity: 0.75,        // Outline opacity
                fillOpacity: 0.6   // Fill opacity
            });
        },
        onEachFeature: onEachFeature
    });

    // Pass the earthquake data to a createMap() function.
    createMap(earthquakes, minDepth, maxDepth);
}

function createMap(earthquakes, minDepth, maxDepth) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlays object.
    let overLayMaps = {
        Earthquakes: earthquakes
    };

    // Create a new map.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a layer control that contains our baseMaps.
    L.control.layers(baseMaps, overLayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Add the legend control for earthquake depth colors.
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
    
        // Define the depth ranges and colors
        let depthRanges = [-10, 10, 30, 50, 70, 90];
        let colors = ["#66FF33", "#BFFF00", "#FFFF00", "#FFA500", "#FF4500", "#FF0000"];
    

    
        // Loop through depthRanges and colors to generate labels
        for (let i = 0; i < depthRanges.length; i++) {
            let rangeLabel =
                i < depthRanges.length - 1
                    ? `${depthRanges[i]}&ndash;${depthRanges[i + 1]}`
                    : `${depthRanges[i]}+`;
    
            div.innerHTML += `
                <div class="legend-item">
                    <span style="background-color: ${colors[i]}; width: 20px; height: 15px; display: inline-block; margin-right: 5px;"></span>
                    ${rangeLabel}
                </div>
            `;
        }
        // Apply styling to the legend container
        div.style.backgroundColor = "white";
        div.style.padding = "8px";
        div.style.borderRadius = "8px";
        div.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
        div.style.fontFamily = "Arial, sans-serif";
        div.style.fontSize = "12px";
        return div;
    };
    
    // Add the legend to the map
    legend.addTo(myMap);
    
}
