$(document).ready(function(){
    $(".dropdown-menu li a").click(function(){
        $(this).parents(".btn-group").find('.btn').text($(this).text());
        $(this).parents(".btn-group").find('.btn').val($(this).data('value'));
    });
    
    var mapOptions = {
        center: new google.maps.LatLng(37.430152, -122.173496),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $("#map-canvas").html("");
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    // Place a draggable marker on the map
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(37.430152, -122.173496),
        map: map,
        icon: 'img/red-pushpin.png',
        draggable:true,
        title:"Destination"
    });
    //Add marker to map
    marker.setMap(map);
    
    //Add event for dragging marker
    google.maps.event.addListener(marker, 'dragend', function() {
        reverseGeocodePosition(marker.getPosition());
    });
    
    //Add event for drop marker button
    $("#dropmarker_button").click(function() {
        geocodePosition($("#cur-address").val(), map, marker);
    });
});

//Reference: http://stackoverflow.com/questions/5688745/google-maps-v3-draggable-marker
function reverseGeocodePosition(position) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': position }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            $("#cur-address").val(results[0].formatted_address);
        }
    });
}

function geocodePosition(position, map, marker) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': position }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            marker.setPosition(results[0].geometry.location);
            map.panTo(results[0].geometry.location);
        }
    });
}