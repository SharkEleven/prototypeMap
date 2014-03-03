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
      events: {
        click: function( marker, event, data ) {
          $( '.js-scroll' ).scrollTo( '.js-marker-' + data.data.id , 200 );
          console.log(data.data.id);
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

  console.log('here');

  Proto.gmap.gmap3( {
    clear: {
      tag: tag
    }
  } );
  
};

Proto.Map.init = function( ) {

  Proto.gmap = $( ".map" ).gmap3( {
    map:{
      options:{
      center:[ 48.4459605 , -73.7159174 ],
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    events:{
      zoom_changed: function( map ) {
        // Proto.Map.appendMarkers( map.getZoom() );
      }
    },
      callback: function( map ) {
        // Proto.Map.appendMarkers( map.getZoom() );
      }
    }

  } );
  Proto.Map.initMarkers();

  $( '.js-default' ).bind( 'click', Proto.Map.init );
  $( '.js-clear' ).bind( 'click', Proto.Map.clearThat );
  $( '.js-toggleCluster' ).bind( 'click', Proto.Map.toggleCluster );

};



$( document ).ready( Proto.Map.init );