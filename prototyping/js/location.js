$(document).ready(function(){
    var currentID = 0;
    if(omletDocument.user_data.length > 0) {
        //Set first thumbnail
        $("#thumbnailID").html(""); //Clear
        var info = omletDocument.user_data[0];
        var HTMLCode = "<h3>"+info.fullname+"</h3><p style=\"font-weight:bold\">Pin Color: "+info.pinColor+"</p>" +
                   "<p style=\"font-weight:bold\">ETA: "+info.ETA+" Minutes</p>";
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
    
    //Now we call the update methods to update map
    updateMap();
    //Register periodic event (setInterval, don't forget to clearInterval on any page button press (back, stop sharing)
    
});

function updateMap() {
    //Add/replace map and markers
    $("#map-canvas").html("");
    if(omletDocument.group_location.present) { //Location sharing started
        var mapOptions = {
            center: new google.maps.LatLng(omletDocument.group_location.lat, omletDocument.group_location.lng),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        // Place a destination marker on the map
        var marker1 = new google.maps.Marker({
            position: new google.maps.LatLng(omletDocument.group_location.lat, omletDocument.group_location.lng),
            map: map,
            icon: 'img/red-pushpin.png',
            title:"Destination"
        });
        marker1.setMap(map);
        for(var i=0; i<omletDocument.user_data.length; i++) {
            if(omletDocument.user_data[i].sharing) {
                var tempMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(omletDocument.user_data[i].location.lat, omletDocument.user_data[i].location.lng),
                    map: map,
                    icon: omletDocument.user_data[i].icon,
                    title: omletDocument.user_data[i].fullname
                });
                tempMarker.setMap(map);
            }
        }
    }
    else {
        var mapOptions = { //Show an empty map
            center: new google.maps.LatLng(0,0),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    }
}

function setDestination(position) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': position }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            $("#destination_text").text(results[0].formatted_address);
        }
        else {
            $("#destination_text").text(position);
        }
    });
}

var omletDocument = {
    "group_location": {
        "present": true,
        "lat": 37.430152,
        "lng": -122.173496
    },
    "user_data": [
        {
            "omletID": "khan",
            "fullname": "Kevin Han",
            "sharing": true,
            "share_start_time": 0,
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
            "share_start_time": 0,
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
            "share_start_time": 0,
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
            "share_start_time": 0,
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
            "share_start_time": 0,
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

var color_to_icon = {"Red": "img/red-dot.png", "Purple": "img/purple-dot.png", "Pink": "img/pink-dot.png", "Orange": "img/orange-dot.png", "Light Blue": "img/ltblue-dot.png", "Green": "img/green-dot.png", "Blue": "img/blue-dot.png", "Yellow": "img/yellow-dot.png"};