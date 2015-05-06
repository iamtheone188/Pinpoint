$(document).ready(function(){
    var currentID = 0;
    $("#leftClick").click(function(){
        if(currentID != 0) {
            currentID -= 1;
            //Change icon colors appropriately
            if(currentID != mapUserInfo.length - 1)
                $("#rightIcon").removeClass("text-muted");
            if(currentID == 0)
                $("#leftIcon").addClass("text-muted");
            
            //fetch user info
            var info = mapUserInfo[currentID];
            
            //Replace HTML
            HTMLCode = "<h3>"+info.fullName+"</h3><p style=\"font-weight:bold\">Pin Color: "+info.pinColor+"</p>" +
                       "<p style=\"font-weight:bold\">ETA: "+info.ETA+" Minutes</p>";
            $("#thumbnailID").html(""); //Clear
            $("#thumbnailID").html(HTMLCode);
        }
    });
    $("#rightClick").click(function(){
        if(currentID != mapUserInfo.length - 1) {
            currentID += 1;
            //Change icon colors appropriately
             if(currentID == mapUserInfo.length - 1)
                $("#rightIcon").addClass("text-muted");
            if(currentID != 0)
                $("#leftIcon").removeClass("text-muted");
            
            //fetch user info
            var info = mapUserInfo[currentID];
            
            //Replace HTML
            HTMLCode = "<h3>"+info.fullName+"</h3><p style=\"font-weight:bold\">Pin Color: "+info.pinColor+"</p>" +
                       "<p style=\"font-weight:bold\">ETA: "+info.ETA+" Minutes</p>";
            $("#thumbnailID").html(""); //Clear
            $("#thumbnailID").html(HTMLCode);
        }
    });
});

var mapUserInfo = [
    {   
        "id": 0,
        "fullName": "Kevin Han",
        "pinColor": "Red",
        "ETA": 2,
        "icon": "img/red-dot.png"
    },
    {
        "id": 1,
        "fullName": "Gabriel Kho",
        "pinColor": "Green",
        "ETA": 4,
        "icon": "img/green-dot.png"
    },
    {
        "id": 2,
        "fullName": "John Doe",
        "pinColor": "Blue",
        "ETA": 7,
        "icon": "img/blue-dot.png"
    },
    {
        "id": 3,
        "fullName": "Jane Doe",
        "pinColor": "Yellow",
        "ETA": 3,
        "icon": "img/yellow-dot.png"
    },
    {
        "id": 4,
        "fullName": "John Smith",
        "pinColor": "Purple",
        "ETA": 11,
        "icon": "img/purple-dot.png"
    }
]