var map;

var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
//Capa de OpenStreetMap
var capaOSM = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© Colaboradores de <a href="http://www.osm.org" target="blank">OpenStreetMap</a>'
});
//Capa de satélite de ArcGIS
var capaSatelite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg', {
  maxZoom: 18,
  attribution: 'Mapas por <a href="http://arcgisonline.com" target="blank">ArcGIS Online</a>'
});

// Crear una agrupación de geometrías/capas para las zonas dibujadas.
var geometriasDibujadas = new L.FeatureGroup();

map = L.map("map", {
  zoom: 15,
  center: [43.263163, -2.935047],
  layers: [mapquestOSM]
});

//Control de capas
L.control.layers(
  {'OpenStreetMap': capaOSM
  ,'Satélite ArcGIS' : capaSatelite
  ,'OSM': mapquestOSM
  }
).addTo(map);

var drawControl = new L.Control.Draw({
    draw: {
      polygon: {
        allowIntersection: false,
        shapeOptions: {
        color: 'black',
        fillColor: 'none'
        }
      },
      rectangle: {
        shapeOptions: {
        color: 'black',
        fillColor: 'none'
        }
      },
      polyline: false,
      circle: false,
      marker: false
    }
});
map.addControl(drawControl);

// Atender el evento cuando se cree una nueva geometría
map.on('draw:created', function (evento) {
  
  console.log('Geometria dibujada1');
  
  geometriasDibujadas.addLayer(evento.layer); // Cargar la geometria dibujada
});

map.on('draw:created', function (evento) {
  
  map.spin(true);
  console.log('Geometria dibujada2');
  
  geometriasDibujadas.clearLayers(); // Borrar la capa de geometrias dibujadas
  
  geometriasDibujadas.addLayer(evento.layer); // Cargar la geometria dibujada

  var geom = evento.layer.toGeoJSON().geometry; // Recoger el GeoJSON de la geometria dibujada
  $.get('http://localhost:3000/general/' + JSON.stringify(geom), function(respuesta){

    console.log('Datos descargados');
    // Una vez descargados los datos desde el servidor, crear una capa con ellos
    //svar capa = L.geoJson(respuesta.geojson);
    L.geoJson(respuesta, {onEachFeature : generarEventos}).addTo(map);
    map.spin(false);
    geometriasDibujadas.clearLayers();

  });
});

/* Larger screens get expanded layer control */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": mapquestOSM};

var overlays = {
};

var layerControl = L.control.layers(baseLayers, overlays, {
  collapsed: isCollapsed
}).addTo(map);


var sidebar = L.control.sidebar("sidebar", {
  closeButton: true,
  position: "left"
}).addTo(map);



function generarEventos( elemento , feature ) {
  feature.on({
    click: function( evento ) {
      if ( evento.target.feature.properties){
        console.log(evento.target.feature.properties);
     feature.bindPopup( "<dl class='dl-horizontal'><dt>ID</dt><dd>"+evento.target.feature.properties.location_id+"</dd><dt>Name</dt><dd>"+evento.target.feature.properties.denom_es+"</dd><dt>Categoria:</dt><dd>"+evento.target.feature.properties.category+"</dd></dl>");
      }
    }
  });

}
/* Placeholder hack for IE */
if (navigator.appName == "Microsoft Internet Explorer") {
  $("input").each(function () {
    if ($(this).val() === "" && $(this).attr("placeholder") !== "") {
      $(this).val($(this).attr("placeholder"));
      $(this).focus(function () {
        if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
      });
      $(this).blur(function () {
        if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
      });
    }
  });
}