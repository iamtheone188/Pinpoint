// Entry into page (will most likely be replaced by Omlet.ready function
$(document).ready(function(){
    //Initialization call to parse
    Parse.initialize("QkXw7fBPJI2f3DpSlP17JaLwjct7mSlAglW921ZD", "Sgpsbwn4Ad8OGmKbZ1wgfMXo0TEtQlaaCCdmFoWX");
    showMainPage();
});

function showMainPage() {
    inLocationScreen = false;
    $("#app").html("");
    parseGet();
    var HTMLCode = '<div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><h1 class="text-center">Pinpoint</h1><img class="image-pp-logo" src="img/pinpoint-logo.jpg" class="img-rounded"></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><button id="share_button" type="button" class="btn btn-block btn-lg btn-primary">Start Sharing Location</button></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><button id="viewmap_button" type="button" class="btn btn-block btn-primary btn-lg">View Map</button></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><h3 class="text-center">Participants</h3><table class="table table-bordered"><thead><tr><th>#</th><th>Name</th><th>Currently Sharing Location?</th><th>Statistics (Click to view)</th></tr></thead><tbody id="tabledata"></tbody></table></div></div>';
    $("#app").append(HTMLCode);
    //Add event handlers
    $("#share_button").click(showNewPage);
    $("#viewmap_button").click(showLocationPage);
    $("#tabledata").html("");
    //Generate Table Data
    for(var i=0; i<omletDocument['user_data'].length; i++) {
        if(omletDocument['user_data'][i]['sharing']) {
            $("#tabledata").append('<tr><td>'+(i+1)+'</td><td>'+omletDocument['user_data'][i]['fullname']+'</td><td>True</td><td><button id="'+omletDocument['user_data'][i]['omletID']+'_button" type="button" class="btn btn-primary">View</button></td></tr>');
        }
        else {
            $("#tabledata").append('<tr><td>'+(i+1)+'</td><td>'+omletDocument['user_data'][i]['fullname']+'</td><td>False</td><td><button id="'+omletDocument['user_data'][i]['omletID']+'_button" type="button" class="btn btn-primary">View</button></td></tr>');
        }
    }
    //Add table button links
    for(var i=0; i<omletDocument['user_data'].length; i++) {
        $("#"+omletDocument['user_data'][i]['omletID']+"_button").click(omletDocument['user_data'][i]['omletID'], showStatsPage);
    }
    
    //Disable share button if user is sharing his/her location
    //TODO: Get user id (temporary for now)
    var omletID = omletIDPrincipal;
    var isUserSharing = false;
    for(var i=0; i<omletDocument.user_data.length; i++) {
        if(omletDocument.user_data[i].omletID == omletID) {
            if(omletDocument.user_data[i].sharing)
                isUserSharing = true;
            break;
        }
    }
    if(isUserSharing)
        $("#share_button").addClass('hidden');
}

function showNewPage() {
    inLocationScreen = false;
    $("#app").html("");
    var HTMLCode = '<div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><button id="back_button" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-chevron-left"></span> Back</button></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><h1 class="text-center">Share Location</h1></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><h3 class="text-center">Meetup in how long?</h3><div class="btn-group btn-block"><button id="time_dropdown" type="button" class="btn btn-block btn-lg btn-primary dropdown-toggle" data-toggle="dropdown">Choose a time<span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="javascript:void(0)" data-value="15" >15 Minutes</a></li><li><a href="javascript:void(0)" data-value="30">30 Minutes</a></li><li><a href="javascript:void(0)" data-value="45">45 Minutes</a></li><li><a href="javascript:void(0)" data-value="60">60 Minutes</a></li><li><a href="javascript:void(0)" data-value="75">75 Minutes</a></li><li><a href="javascript:void(0)" data-value="90">90 Minutes</a></li><li><a href="javascript:void(0)" data-value="120">120 Minutes</a></li></ul></div></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><h3 class="text-center">Method of Travel (Optional)</h3><div class="btn-group btn-block"><button id="method_dropdown" type="button" class="btn btn-block btn-lg btn-primary dropdown-toggle" data-toggle="dropdown">No Method Selected <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="javascript:void(0)" data-value="Walk">Walk</a></li><li><a href="javascript:void(0)" data-value="Bike">Bike</a></li><li><a href="javascript:void(0)" data-value="Car">Car</a></li></ul></div></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><h3 class="text-center">Location</h3><div id="addr_string" class="hidden"></div><form id="address_form" role="form"><div class="form-group"><label for="inputdefault">Address:</label><input id="cur-address" class="form-control" type="text" placeholder="Gates Computer Science, Stanford, CA, 94305"></div></form></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><button id="dropmarker_button" type="button" class="btn btn-block btn-lg btn-success">Drop Marker</button></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><div id="map-canvas" class="image-map" style="width: 300px; height: 300px;"><h1>Loading map...</h1></div></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><button id="share_button" type="button" class="btn btn-block btn-lg btn-success">Share</button></div></div>';
    $("#app").append(HTMLCode);
    //Add event handlers
    $(".dropdown-menu li a").click(function(){
        $(this).parents(".btn-group").find('.btn').text($(this).text());
        $(this).parents(".btn-group").find('.btn').val($(this).data('value'));
    });
    $("#back_button").click(showMainPage);
    
    //Add map functionality
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
    newPageCurrentLat = 37.430152;
    newPageCurrentLng = -122.173496;
    
    //Add event for dragging marker
    google.maps.event.addListener(marker, 'dragend', function() {
        newPageCurrentLat = marker.getPosition().lat();
        newPageCurrentLng = marker.getPosition().lng();
        reverseGeocodePosition(marker.getPosition());
    });
    
    //Add event for drop marker button
    $("#dropmarker_button").click(function() {
        geocodePosition($("#cur-address").val(), map, marker);
    });
    
    //If location has already been specified by another group member (present = true), disable all inputs and show map destination
    if(omletDocument.group_location.present) {
        $('#time_dropdown').text(omletDocument.group_location.share_time);
        $('#time_dropdown').val(omletDocument.group_location.share_time);
        $('#time_dropdown').addClass('disabled');
        $('#address_form').addClass('hidden');
        $('#map-canvas').addClass('hidden');
        $('#dropmarker_button').addClass('hidden');
        $('#addr_string').append('<h3>'+omletDocument.group_location.address_string+'</h3>');
        $('#addr_string').removeClass('hidden');
    }
    
    //Share button
    $("#share_button").click(function(event) {
        var time = $('#time_dropdown')[0].value;
        var method = $('#method_dropdown')[0].value;
        if(method == "")
            method = "N/A";
        if(time == "") {
            alert("Error! Please choose a meetup time!");
            showNewPage();
        }
        else if (!navigator.geolocation) {
            alert("Browser does NOT support geolocation!");
            showMainPage();
        }
        else {
            //If user is the first to share location, update group_location
            if(!omletDocument.group_location.present) {
                omletDocument.group_location.present = true;
                omletDocument.group_location.start_time = new Date().getTime();
                omletDocument.group_location.share_time = time;
                omletDocument.group_location.lat = newPageCurrentLat;
                omletDocument.group_location.lng = newPageCurrentLng;
                
                //Update address string
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': new google.maps.LatLng(newPageCurrentLat, newPageCurrentLng) }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        omletDocument.group_location.address_string = results[0].formatted_address;
                    }
                });
            }
            
            //TODO: Get user id (temporary for now)
            var omletID = omletIDPrincipal;
            for(var i=0; i<omletDocument.user_data.length; i++) {
                if(omletDocument.user_data[i].omletID == omletID) {
                    omletDocument.user_data[i].sharing = true;
                    omletDocument.user_data[i].travel_method = method;
                    
                    //Update numTrips on parse database
                    parseIncrement(omletID, 'numTrips');
                    break;
                }
            }
            //set Watchposition to update position
            var options = {enableHighAccuracy: true};
            watchPositionID = navigator.geolocation.watchPosition(positionUpdate, positionError, options);
            showLocationPage();
        }
    });
}

function showLocationPage() {
    inLocationScreen = true;
    $("#app").html("");
    var HTMLCode = '<div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><button id="back_button" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-chevron-left"></span> Back</button></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-1 column"><div class="thumbnail thumb-center"><a id="leftClick" href="#"><span id="leftIcon" class="glyphicon glyphicon-chevron-left text-muted"></span></a></div></div><div class="col-xs-9 column"><div id="thumbnailID" class="thumbnail"><h1>No Users/Loading...</h1></div></div><div class="col-xs-2 column"><div class="thumbnail thumb-center"><a id="rightClick" href="#"><span id="rightIcon" class="glyphicon glyphicon-chevron-right"></span></a></div></div></div><hr \><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><div class="panel panel-info"><div class="panel-heading"><h2 class="text-center">Destination:</h2><h3 id="destination_text" class="text-center"></h3></div></div></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><div id="map-canvas" class="image-map" style="width: 300px; height: 300px;"><h1>Loading map...</h1></div></div></div><hr \><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><button id="checkin_button" type="button" class="btn btn-block btn-lg btn-success disabled">Check In</button></div></div><div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><button id="stopshare_button" type="button" class="btn btn-block btn-lg btn-danger">Stop Sharing Location</button></div></div>';
    $("#app").append(HTMLCode);
    //Add event handlers
    $("#back_button").click(showMainPage);
    $("#stopshare_button").click(function() {
        //TODO: Get user id (temporary for now)
        var omletID = omletIDPrincipal;
        for(var i=0; i<omletDocument.user_data.length; i++) {
            if(omletDocument.user_data[i].omletID == omletID) {
                omletDocument.user_data[i].sharing = false;
                break;
            }
        }
        clearInterval(mapSetIntervalID);
        mapSetIntervalID = -1;
        mapInstance = null;
        markersArray = []
        stopShareCheck();
        showMainPage();
    });
    if(checkInEnabled) { //Enable the check in button and add functionality
        $("#checkin_button").removeClass("disabled");
        $("#checkin_button").click(function() {
            checkInUpdate();
            stopShareCheck();
        });
    }
    else
        $("#checkin_button").addClass("disabled");
    var currentID = 0;
    if(omletDocument.user_data.length > 0) {
        //Set first thumbnail
        $("#thumbnailID").html(""); //Clear
        var info = omletDocument.user_data[0];
        var HTMLCode = "<h3>"+info.fullname+"</h3><p style=\"font-weight:bold\">Pin Color: "+info.pinColor+"</p>" +
                   "<p style=\"font-weight:bold\">ETA: "+info.ETA+"</p>";
        $("#thumbnailID").html(HTMLCode);
    }
    else { //No users, mute both buttons
        $("#rightIcon").addClass("text-muted");
    }
    
    $("#leftClick").click(function(){
        if(currentID != 0) {
            currentID -= 1;
            //Change icon colors appropriately
            if(currentID != omletDocument.user_data.length - 1)
                $("#rightIcon").removeClass("text-muted");
            if(currentID == 0)
                $("#leftIcon").addClass("text-muted");
            
            //fetch user info
            var info = omletDocument.user_data[currentID];
            
            //Replace HTML
            var HTMLCode = "<h3>"+info.fullname+"</h3><p style=\"font-weight:bold\">Pin Color: "+info.pinColor+"</p>" +
                       "<p style=\"font-weight:bold\">ETA: "+info.ETA+" Minutes</p>";
            $("#thumbnailID").html(""); //Clear
            $("#thumbnailID").html(HTMLCode);
        }
    });
    $("#rightClick").click(function(){
        if(currentID != omletDocument.user_data.length - 1) {
            currentID += 1;
            //Change icon colors appropriately
             if(currentID == omletDocument.user_data.length - 1)
                $("#rightIcon").addClass("text-muted");
            if(currentID != 0)
                $("#leftIcon").removeClass("text-muted");
            
            //fetch user info
            var info = omletDocument.user_data[currentID];
            
            //Replace HTML
            var HTMLCode = "<h3>"+info.fullname+"</h3><p style=\"font-weight:bold\">Pin Color: "+info.pinColor+"</p>" +
                       "<p style=\"font-weight:bold\">ETA: "+info.ETA+" Minutes</p>";
            $("#thumbnailID").html(""); //Clear
            $("#thumbnailID").html(HTMLCode);
        }
    });
    //Update destination text
    if(omletDocument.group_location.present) {
        var pos = new google.maps.LatLng(omletDocument.group_location.lat, omletDocument.group_location.lng);
        setDestination(pos);
    }
    else {
        $("#destination_text").val('Not Set');
    }
    //If map doesn't exist, create it (Center at destination)
    if(mapInstance == undefined || mapInstance == null)
        mapInstance = createMap();
    else
        recreateMap(mapInstance);
    //Now we call the update methods to update map
    updateMap(mapInstance);
    //Register periodic event (setInterval, don't forget to clearInterval on any page button press (back, stop sharing)
    if(mapSetIntervalID == -1) {
        mapSetIntervalID = setInterval(updateMapHandler, 10000);
    }
    
    //Disable stop share button if user is NOT sharing his/her location
    //TODO: Get user id (temporary for now)
    var omletID = omletIDPrincipal;
    var isUserSharing = false;
    for(var i=0; i<omletDocument.user_data.length; i++) {
        if(omletDocument.user_data[i].omletID == omletID) {
            if(omletDocument.user_data[i].sharing)
                isUserSharing = true;
            break;
        }
    }
    if(!isUserSharing)
        $("#stopshare_button").addClass('hidden');
}

function showStatsPage(event) {
    inLocationScreen = false;
    var omletID = event.data;
    $("#app").html("");
    var HTMLCode = '<div class="row clearfix" style="margin-top:20px"><div class="col-xs-12 column"><button id="back_button" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-chevron-left"></span>Back</button></div></div><div class="row clearfix" style="margin-top:20px"><div id="tableData" class="col-xs-12 column"></div></div>';
    $("#app").append(HTMLCode);
    //Add event handlers
    $("#back_button").click(showMainPage);
    //Generate Table Data
    //Find username in stats
    var info = localstats[omletID];
    var onTimePct = (((parseInt(info.onTimeTrips)) / (parseInt(info.numTrips)))*100).toFixed(2);
    var HTMLTableCode = "<table id=\"tableData\" class=\"table table-bordered\"><tbody>" +
                        "<tr><td style=\"font-weight:bold\">Name</td><td>"+info.fullName+"</td></tr>" +
                        "<tr><td style=\"font-weight:bold\">Total Number of Trips</td><td>"+info.numTrips+"</td></tr>" +
                        "<tr><td style=\"font-weight:bold\">Number of Trips On Time</td><td>"+info.onTimeTrips+"</td></tr>" +
                        "<tr><td style=\"font-weight:bold\">On-Time Percentage</td><td>"+onTimePct+"%</td></tr>" +
                        "<tr><td style=\"font-weight:bold\">Total Omlet Dollars Earned</td><td>"+info.OMDEarned+" OMD</td></tr>" +
                        "</tbody></table>";
    $('#tableData').html(''); //Clear
    $('#tableData').html(HTMLTableCode);
}

/* Helper functions */
function positionUpdate(pos) {
    //TODO: Get user id (temporary for now)
    var tempLat = pos.coords.latitude;
    var tempLng = pos.coords.longitude;
    var omletID = omletIDPrincipal;
    var curSharing;
    for(var i=0; i<omletDocument.user_data.length; i++) {
        if(omletDocument.user_data[i].omletID == omletID) {
            curSharing = omletDocument.user_data[i].sharing;
            break;
        }
    }
    if(!curSharing) { //Not sharing anymore, stop the watchPosition event
        navigator.geolocation.clearWatch(watchPositionID);
        watchPositionID = -1;
        return;
    }
    else {
        //Here we update the ETA and Location(Lat/Lng)
        for(var i=0; i<omletDocument.user_data.length; i++) {
            if(omletDocument.user_data[i].omletID == omletID) {
                omletDocument.user_data[i].location.lat = tempLat;
                omletDocument.user_data[i].location.lng = tempLng;
                //Update ETA and check in button
                var origin = new google.maps.LatLng(tempLat, tempLng);
                var destination = new google.maps.LatLng(omletDocument.group_location.lat, omletDocument.group_location.lng);
                var service = new google.maps.DistanceMatrixService();
                var travelMode;
                if(omletDocument.user_data[i].travel_method == "Car")
                    travelMode = google.maps.TravelMode.DRIVING;
                else if(omletDocument.user_data[i].travel_mode == "Bike")
                    travelMode = google.maps.TravelMode.BICYCLING;
                else
                    travelMode = google.maps.TravelMode.WALKING;
                service.getDistanceMatrix({"origins": [origin], "destinations": [destination], "travelMode": travelMode}, ETAUpdate);
                break;
            }
        }
    }
}

function ETAUpdate(response, status) {
    if (status == google.maps.DistanceMatrixStatus.OK) {
        //TODO: Get user id (temporary for now)
        var omletID = omletIDPrincipal;
        for(var i=0; i<omletDocument.user_data.length; i++) {
            if(omletDocument.user_data[i].omletID == omletID) {
                if(omletDocument.user_data[i].travel_method != "N/A") {
                    omletDocument.user_data[i].ETA = response.rows[0].elements[0].duration.text;
                    break;
                }
            }
        }
        //Now check to see if user is 100 meters from destination, in which case, enable check in button
        if(response.rows[0].elements[0].distance.value <= 100) {
            checkInEnabled = true;
            if(inLocationScreen) {
                $("#checkin_button").removeClass("disabled");
                $("#checkin_button").click(function() {
                    checkInUpdate();
                });
            }
        }
        else {
            checkInEnabled = false;
            
            if(inLocationScreen) {
                $("#checkin_button").addClass("disabled");
            }
        }
    }
}

function positionError(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

//Reference: http://stackoverflow.com/questions/5688745/google-maps-v3-draggable-marker
function reverseGeocodePosition(position) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': position }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            $("#cur-address").val(results[0].formatted_address);
        }
    });
}

function setDestination(position) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': position }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            $("#destination_text").text(results[0].formatted_address);
        }
        else {
            $("#destination_text").text(position);
        }
    });
}

function geocodePosition(position, map, marker) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': position }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            newPageCurrentLat = results[0].geometry.location.lat();
            newPageCurrentLng = results[0].geometry.location.lng();
            marker.setPosition(results[0].geometry.location);
            map.panTo(results[0].geometry.location);
        }
    });
}

function updateMapHandler() {
    if(!inLocationScreen) { //clearInterval
        clearInterval(mapSetIntervalID);
        mapSetIntervalID = -1;
        mapInstance = null;
        markersArray = []
    }
    else {
        //Try to catch scenario where we leave location screen during map update
        if(document.getElementById('map-canvas') != null) {
            updateMap(mapInstance);
        }
    }
}

function createMap() {
    $("#map-canvas").html("");
    var map;
    if(omletDocument.group_location.present) { //Location sharing started
        var mapOptions = {
            center: new google.maps.LatLng(omletDocument.group_location.lat, omletDocument.group_location.lng),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    }
    else {
        var mapOptions = { //Show an empty map
            center: new google.maps.LatLng(0,0),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    }
    return map;
}

function recreateMap() {
    $("#map-canvas").html("");
    var mapOptions = {
        center: mapInstance.getCenter(),
        zoom: mapInstance.getZoom(),
        mapTypeId: mapInstance.getMapTypeId()
    };
    mapInstance = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

function updateMap(map) {
    //Remove current destination markers
    for(var i=0; i<markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
    
    // Place destinations marker on the map
    var marker1 = new google.maps.Marker({
        position: new google.maps.LatLng(omletDocument.group_location.lat, omletDocument.group_location.lng),
        map: map,
        icon: 'img/red-pushpin.png',
        title:"Destination"
    });
    marker1.setMap(map);
    markersArray.push(marker1);
    for(var i=0; i<omletDocument.user_data.length; i++) {
        if(omletDocument.user_data[i].sharing) {
            var tempMarker = new google.maps.Marker({
                position: new google.maps.LatLng(omletDocument.user_data[i].location.lat, omletDocument.user_data[i].location.lng),
                map: map,
                icon: omletDocument.user_data[i].icon,
                title: omletDocument.user_data[i].fullname
            });
            tempMarker.setMap(map);
            markersArray.push(tempMarker);
        }
    }
}

function checkInUpdate() {
    console.log("TODO");
}

//If no one in the chat is sharing anymore, clear group_location
function stopShareCheck() {
    var allStopped = true;
    //Replace with Omlet Global Document
    for(var i=0; i<omletDocument.user_data.length; i++) {
        if(omletDocument.user_data[i].sharing) {
            allStopped = false;
            break;
        }
    }
    if(allStopped) { //Clear group_location (set to default values)
        omletDocument.group_location = {
            "present": false,
            "start_time": 0,
            "share_time": 0,
            "lat": 0,
            "lng": 0,
            "address_string": ""
        };
    }
}

function parseAddUser(omletID, fullName) {
    var Stats = Parse.Object.extend("Stats");
    var query = new Parse.Query(Stats);
    query.get("FCp1oHcDNh", {
        success: function(stats) {
            var placeholder = {"omletID": omletID, "fullName": fullName, "numTrips": 0,
                       "onTimeTrips": 0, "OMDEarned": 0};
            stats.set(omletID, placeholder);
            stats.save();
        },
        error: function(object, error) {
            alert(error);
        }
    });
}

function parseRemoveUser(omletID) { //Sets column to undefined
    var Stats = Parse.Object.extend("Stats");
    var query = new Parse.Query(Stats);
    query.get("FCp1oHcDNh", {
        success: function(stats) {
            stats.unset(omletID);
            stats.save();
        },
        error: function(object, error) {
            alert(error);
        }
    });
}

function parseUpdate(omletID, key, value) {
    var Stats = Parse.Object.extend("Stats");
    var query = new Parse.Query(Stats);
    query.get("FCp1oHcDNh", {
        success: function(stats) {
            var tempStats = stats.get(omletID);
            tempStats[key] = value;
            stats.set(omletID, tempStats);
            stats.save();
        },
        error: function(object, error) {
            alert(error);
        }
    });
}

function parseIncrement(omletID, key) {
    var Stats = Parse.Object.extend("Stats");
    var query = new Parse.Query(Stats);
    query.get("FCp1oHcDNh", {
        success: function(stats) {
            var tempStats = stats.get(omletID);
            tempStats[key] += 1;
            stats.set(omletID, tempStats);
            stats.save();
        },
        error: function(object, error) {
            alert(error);
        }
    });
}

function parseGet() { //Update stats database, fired every time we visit the main page
    var Stats = Parse.Object.extend("Stats");
    var query = new Parse.Query(Stats);
    query.get("FCp1oHcDNh", {
        success: function(stats) {
            localstats = stats.toJSON();
        },
        error: function(object, error) {
            alert(error);
        }
    });
}

/* Temporary JSON/Database files */
//Will be replaced by global Omlet JSON document
var omletDocument = {
    "group_location": {
        "present": false,
        "start_time": 0,
        "share_time": 0,
        "lat": 0,
        "lng": 0,
        "address_string": ""
    },
    "user_data": [
        {
            "omletID": "khan",
            "fullname": "Kevin Han",
            "sharing": false,
            "travel_method": "N/A",
            "pinColor": "Red",
            "ETA": 2,
            "icon": "img/red-dot.png",
            "location": {
                "lat": 37.427917,
                "lng": -122.174294
            }
        },
        {
            "omletID": "gkho",
            "fullname": "Gabriel Kho",
            "sharing": true,
            "travel_method": "N/A",
            "pinColor": "Green",
            "ETA": 4,
            "icon": "img/green-dot.png",
            "location": {
                "lat": 37.429422,
                "lng": -122.173869
            }
        },
        {
            "omletID": "jhdoe",
            "fullname": "John Doe",
            "sharing": true,
            "travel_method": "N/A",
            "pinColor": "Blue",
            "ETA": 7,
            "icon": "img/blue-dot.png",
            "location": {
                "lat": 37.429291,
                "lng": -122.172210
            }
        },
        {
            "omletID": "jndoe",
            "fullname": "Jane Doe",
            "sharing": true,
            "travel_method": "N/A",
            "pinColor": "Yellow",
            "ETA": 3,
            "icon": "img/yellow-dot.png",
            "location": {
                "lat": 37.428204,
                "lng": -122.175624
            }
        },
        {
            "omletID": "jsmith",
            "fullname": "John Smith",
            "sharing": true,
            "travel_method": "N/A",
            "pinColor": "Purple",
            "ETA": 11,
            "icon": "img/purple-dot.png",
            "location": {
                "lat": 37.431905,
                "lng": -122.175787
            }
        }
    ]
};

var localstats; //Local Parse Object

//Temporary ID
var omletIDPrincipal = "khan";

//Map icons
var map_icons = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Light Blue"];

var color_to_icon = {"Red": "img/red-dot.png", "Purple": "img/purple-dot.png", "Pink": "img/pink-dot.png", "Orange": "img/orange-dot.png", "Light Blue": "img/ltblue-dot.png", "Green": "img/green-dot.png", "Blue": "img/blue-dot.png", "Yellow": "img/yellow-dot.png"};

//Global variables for map/location update
var watchPositionID = -1;
var mapSetIntervalID = -1;
var inLocationScreen = false;
var mapInstance = null;
var markersArray = [];
var checkInEnabled = false;
var newPageCurrentLat;
var newPageCurrentLng;