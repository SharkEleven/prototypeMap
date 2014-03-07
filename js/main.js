if ( !Proto ) {
  var Proto = {};
}

Proto.gmap = {};
Proto.Map = {};
Proto.Map.markerList = markers;

// Proto.Map.pathMarkerIcon = 'img/icons/icon-marker.png';
Proto.Map.pathMarkerIcon = new google.maps.MarkerImage("http://maps.gstatic.com/mapfiles/icon_green.png");


Proto.Map.addMarkersClustering = function( markerList, markerIcon, clusters ) {

  Proto.gmap.gmap3( {
    action: 'addMarkers',
    // radius: 75,
    // markers: markerList,
    // clusters: clusters,
    marker: {
      values: markerList,
      options: {
          icon: markerIcon
      },
      // tag: markerList.data.tag
      events: {
        click: function( marker, event, data ) {
          $( '.js-scroll' ).scrollTo( '.js-marker-' + data.data.id , 200 );
          console.log(marker);
          // var content = Feis.Map.setContent( data );
          // var map = $( this ).gmap3( 'get' );
          // infowindow = $( this ).gmap3( { action:'get' , name:'infowindow' } );
          // if ( infowindow ) {
          //   infowindow.open( map, marker );
          //   infowindow.setContent( content );
          // } else {
          //   $( this ).gmap3( {
          //     action:'addinfowindow',
          //     anchor:marker,
          //     options:{
          //       content: content
          //     }
          //   } );
          // }

        },
        mouseover: function( marker, event, data ) {
          // var map = $( this ).gmap3( 'get' );
          // var content = Feis.Map.setContent( data );
          // infowindow = $( this ).gmap3( { action:'get' , name:'infowindow' } );
          // if ( infowindow ) {
          //   infowindow.open( map, marker );
          //   infowindow.setContent( content );
          // } else {
          //   $( this ).gmap3( {
          //     action: 'addinfowindow',
          //     anchor: marker,
          //     options:{
          //       content: content
          //     }
          //   } );
          // }
        }
      },
      cluster:{
        radius: 100,
        events:{
          mouseover: function(cluster){
            $(cluster.main.getDOMElement()).css("border", "1px solid red");
          },
          mouseout: function(cluster){
            $(cluster.main.getDOMElement()).css("border", "0px");
          }
        },
        0: {
          content: "<div class='cluster cluster-1'>CLUSTER_COUNT</div>",
          width: 53,
          height: 52
        },
        20: {
          content: "<div class='cluster cluster-2'>CLUSTER_COUNT</div>",
          width: 56,
          height: 55
        },
        50: {
          content: "<div class='cluster cluster-3'>CLUSTER_COUNT</div>",
          width: 66,
          height: 65
        }
      }
    },
    autofit: {}
  } );

};


Proto.Map.getMarkersFromDatabase = function( zoomLevel ) {
  var i, j, result = [];

  if( zoomLevel < 5 ){
    for( i=0; i<database.length; i++ ) {
      result.push( {
        latLng:database[i].main.pos,
        data:{
          label: database[i].main.label,
          count: database[i].list.length
        }
      } );
    }
  } else {
    for( i=0; i<database.length; i++ ) {
      for( j=0; j<database[i].list.length; j++ ) {
        result.push( {
          latLng:database[i].list[j].pos,
          data:{
            label: database[i].list[j].label,
            count: 1
          }
        } );
      }
    }
  }
  console.log(result);
  return result;
};

//add markers
Proto.Map.appendMarkers = function( zoomLevel ) {
  $( ".map" ).gmap3( {
    clear:{name:"clusterer"},
    marker:{
      values: Proto.Map.getMarkersFromDatabase(zoomLevel),
      events: {
        click: function( marker, event, data ) {
          console.log( data );
          // $( '.js-scroll' ).scrollTo( '.js-article-' + data.id , 200 );
        }
      },
      cluster:{
        radius:100,
        calculator: function(values){
          var i, cnt = 0;
          for( i=0; i<values.length; i++){
            if (values[i] && values[i].data && values[i].data.count){
              cnt += values[i].data.count;
            } else {
              cnt++;
            }
          }
          return cnt;
        },
        0: {
          content: "<div class='cluster cluster-1'>CLUSTER_COUNT</div>",
          width: 53,
          height: 52
        },
        20: {
          content: "<div class='cluster cluster-2'>CLUSTER_COUNT</div>",
          width: 56,
          height: 55
        },
        50: {
          content: "<div class='cluster cluster-3'>CLUSTER_COUNT</div>",
          width: 66,
          height: 65
        }
      },
      options: {
        icon: new google.maps.MarkerImage("http://maps.gstatic.com/mapfiles/icon_green.png")
      }
    }
  });
}


Proto.Map.initMarkers = function() {

  Proto.Map.addMarkersClustering( Proto.Map.markerList, Proto.Map.pathMarkerIcon , Proto.Map.clusters );
}

//Clear
Proto.Map.clearThat = function() {

  var tg = $("#target").val(),
  wh = $("#which").val(),
  opts = {};

  if (tg != "all"){
    opts.name = tg;
  }

  if (wh == "first"){
    opts.first = true;
  }

  if (wh == "last"){
    opts.last = true;
  }

  Proto.gmap.gmap3( { clear:opts } );
};


Proto.Map.clearMarkersByTag = function( tag ) {

  console.log( $( this ).attr( 'id' ) );

  var markers = $( ".map" ).gmap3( {
    get: { 
      name: 'markers',
      tag: $( this ).attr( 'id' )
    }
  } );

    console.log( 'marker' );
    console.log( markers );

    // if(marker.id == markerId){marker.setVisible(false);}

  

  // Proto.gmap.gmap3( {
  //   clear: {
  //     tag: $( this ).attr( 'id' )
  //   }
  // } );
  
};


Proto.Map.userGeoloc = function( ) {

  function success(position) {
    console.log(position);
    
   
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var myOptions = {
      zoom: 15,
      center: latlng,
      mapTypeControl: false,
      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
    
    var marker = new google.maps.Marker({
        position: latlng, 
        map: map, 
        title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
    });
  }

  function error( msg ) {    
    console.log(msg);
  }

  if( navigator.geolocation ) {
    navigator.geolocation.getCurrentPosition( success, error );
  } else {
    error('not supported');
  }
}

$( '#subUserZip' ).on( 'click' , function( ) {

    var userZip = $( '.js-zipValue' ).val();

    console.log( userZip );

    $('.map').gmap3({
      getlatlng:{
        address:  userZip,
        callback: function( results ){
          
          if( results ) {
            console.log(results);
            $( '.map' ).gmap3( {
              marker:{
                latLng:results[0].geometry.location
              }
            } );
            $(this).gmap3("get").setCenter(results[0].geometry.location);
          } else {
            console.log('error');
          }
        }
      }
    } );

  } );



Proto.Map.init = function( ) {

  var styles = [
    {
      stylers: [
        { hue: "#00ffe6" },
        { saturation: -20 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  var styledMap = new google.maps.StyledMapType( styles, { name: "Styled Map" } );

  Proto.gmap = $( ".map" ).gmap3( {
    map:{
      options:{
        center:[ 48.4459605 , -73.7159174 ],
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
           mapTypeIds: [google.maps.MapTypeId.ROADMAP, "style1", "style2"]
        }
      },
      events:{
        zoom_changed: function( map ) {
          // Proto.Map.appendMarkers( map.getZoom() );
        }
      },
        callback: function( map ) {
          // Proto.Map.appendMarkers( map.getZoom() );
        }
    },
    styledmaptype:{
      id: "style1",
      options:{
        name: "Style 1"
      },
      styles: [
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [
            { hue: "#0000000" },
            { saturation: 90 },
            { lightness: -20 }
          ]
        }
      ]
    },
    // styledmaptype:{
    //   id: "style2",
    //   options:{
    //     name: "Style 2"
    //   },
    //   styles: [
    //     {
    //       featureType: "road.highway",
    //       elementType: "geometry",
    //       stylers: [
    //         { hue: "red" },
    //         { saturation: 60 },
    //         { lightness: -20 }
    //       ]
    //     },{
    //       featureType: "road.arterial",
    //       elementType: "all",
    //       stylers: [
    //         { hue: "black" },
    //         { lightness: -40 },
    //         { visibility: "simplified" },
    //         { saturation: 30 }
    //       ]
    //     },{
    //       featureType: "road.local",
    //       elementType: "all",
    //       stylers: [
    //         { hue: "blue" },
    //         { saturation: 50 },
    //         { gamma: 0.7 },
    //         { visibility: "simplified" }
    //       ]
    //     }
    //   ]
    // }
    kmllayer:{
      options:{
        url: "http://bbs.keyhole.com/ubb/ubbthreads.php?ubb=download&Number=796978&filename=R%C3%A9gions%20administratives%20du%20Qu%C3%A9bec.kmz",
        opts:{
          suppressInfoWindows: true
        }
      },
      events:{
        click: function(kml, event){
          alert(event.featureData.description);
        }
      }
    }

  } );
  
  Proto.Map.initMarkers();

  Proto.Map.userGeoloc();

  $( '.js-default' ).bind( 'click', Proto.Map.init );
  $( '.js-clear' ).bind( 'click', Proto.Map.clearThat );
  $( '.js-toggleCluster' ).bind( 'click', Proto.Map.toggleCluster );
  $( '.js-tag' ).bind( 'click', Proto.Map.clearMarkersByTag );

};






$( document ).ready( Proto.Map.init );