// Find present device location
var lat,lon;


// Request Location
document.getElementById("request-geo").addEventListener("click", requestGeo);

function requestGeo() {
  if ("geolocation" in navigator) 
  {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);
  } 
  else
  {
    console.log("No support");
  }
}

function geoSuccess(pos) {
    var crd = pos.coords;
    lat = crd.latitude;
    lon = crd.longitude;
    
    GetMap();
  }

function geoFailure(error) 
{
  console.log(error);
}

  // Find mental health clinics on map
  function GetMap() {          
    // Instantiate a map object
    var map = new atlas.Map('myMap', {
        view: 'Auto',
        showLogo: false,
        //Add authentication details for connecting to Azure Maps.
        authOptions: {            
            authType: 'subscriptionKey',
            subscriptionKey: 'BWqFiXxZP9rfe-C-Bp-wOskE-9jrDKpTWzI-Rmg5W7Y'
        }
    });
    console.log("Wait1");
    //Wait until the map resources are ready.
    map.events.add('ready', function () {

        //Create a data source and add it to the map.
        datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        //Add a layer for rendering point data.
        var resultLayer = new atlas.layer.SymbolLayer(datasource, null, {
            iconOptions: {
                image: 'pin-round-darkblue',
                anchor: 'center',
                allowOverlap: true
            },
            textOptions: {
                anchor: "top"
            }
        });

        map.layers.add(resultLayer);
        console.log("Wait2"); 

        //Use MapControlCredential to share authentication between a map control and the service module
        var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.MapControlCredential(map));

        // Construct the SearchURL object
        var searchURL = new atlas.service.SearchURL(pipeline);

        var query = 'psychiatrist';
        var radius = 9000;
        
        searchURL.searchPOI(atlas.service.Aborter.timeout(5000), query, {
            limit: 10,
            lat: lat,
            lon: lon,
            radius: radius,
            view: 'Auto'
        }).then((results) => {

            // Extract GeoJSON feature collection from the response and add it to the datasource
            var data = results.geojson.getFeatures();
            datasource.add(data);

            // set camera to bounds to show the results
            map.setCamera({
                // bounds: data.bbox,
                bounds: atlas.data.BoundingBox.fromData(data),
                zoom: 10,
                padding: 15
            });
            console.log("Wait3");
          
        });

        //Create a popup but leave it closed so we can update it and display it later.
        popup = new atlas.Popup();

        //Add a mouse over event to the result layer and display a popup when this event fires.
        map.events.add('mouseover', resultLayer,showPopup);
        

        function showPopup(e) {
            //Get the properties and coordinates of the first shape that the event occurred on.
            var p = e.shapes[0].getProperties();
            var position = e.shapes[0].getCoordinates();

            //Create HTML from properties of the selected result.
            var html = ['<div style="padding:5px"><div><b>', p.poi.name,
                '</b></div><div>', p.address.freeformAddress,
                '</div><div>', position[1], ', ', position[0], '</div></div>'];

            //Update the content and position of the popup.
            popup.setPopupOptions({
                content: html.join(''),
                position: position
            });

            //Open the popup.
            popup.open(map);
        }
    });
}