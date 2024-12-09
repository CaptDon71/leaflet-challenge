// Store GEOJSON API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
    console.log(data.features);


    // Pass the features to a createFeatures() function:
    createFeatures(data.features);
  // Store GEOJSON API endpoint for earthquakes and tectonic plates.
let earthquakeQueryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicPlatesQueryUrl = "/GeoJson/PB2002_plates.json"; 

fetch('/GeoJson/PB2002_plates.json')
.then(response => response.json())
.then(data => {
  // Add tectonic plate layer
  L.geoJSON(data, {
    style: stylePlates
  }).addTo(map);
})
.catch(error => console.error('Error loading GeoJSON:', error));
// Perform a GET request to the earthquake query URL.
d3.json(earthquakeQueryUrl).then(function (data) {
    console.log(data.features);

    // Pass the features to a createFeatures() function:
    createFeatures(data.features);
});

// Perform a GET request to the tectonic plates query URL.
d3.json(tectonicPlatesQueryUrl).then(function (data) {
    console.log(data.features);

    // Pass the features to a createTectonicPlates() function:
    createTectonicPlates(data.features);
});

// Create features for earthquakes
function createFeatures(earthquakeData) {
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
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Create a GeoJSON layer for the earthquakes
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
    createMap(earthquakes);
}

// Create features for tectonic plates
function createTectonicPlates(tectonicData) {
    // Create a GeoJSON layer for the tectonic plates
    let tectonicPlates = L.geoJSON(tectonicData, {
        style: {
            color: "#FF6347",  // Red color for tectonic plates
            weight: 2,
            opacity: 0.7
        }
    });

    // Add tectonic plates to the map
    createMap(tectonicPlates);
}

// Create the map
function createMap(earthquakes, tectonicPlates) {
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

    // Create an overlays object for earthquakes and tectonic plates.
    let overLayMaps = {
        Earthquakes: earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    // Create a new map.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]  // Default layers (street map and earthquakes)
    });

    // Create a layer control that contains our baseMaps and overlayMaps.
    L.control.layers(baseMaps, overLayMaps, {
        collapsed: false
    }).addTo(myMap);
}

  });

  function createFeatures(earthquakeData) {

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
    createMap(earthquakes);
  
  }
  
  function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
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
    // Edit the code to add the earthquake data to the layers.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control that contains our baseMaps.
    // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
    L.control.layers(baseMaps, overLayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  }