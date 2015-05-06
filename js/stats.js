$(document).ready(function(){
    var username = getUrlParameter('username');
    
    //Get JSON file and parse
    var jsonData
    $.ajax({
        url: "../db/db.json",
        //force to handle it as text
        dataType: "text",
        success: function(data) {
            
            //data downloaded so we call parseJSON function 
            //and pass downloaded data
            jsonData = $.parseJSON(data);
        }
    });
    console.log(jsonData.stats);
});

//Code taken from http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}