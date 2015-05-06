$(document).ready(function(){
    var username = getUrlParameter('username');
    
    //Find username in stats
    var info;
    for(var i=0; i<stats.length; i++) {
        if(stats[i].userName == username) {
            info = stats[i];
            break;
        }
    }
    
    var HTMLCode = "<table id=\"tableData\" class=\"table table-bordered\"><tbody>" +
                   "<tr><td style=\"font-weight:bold\">Name</td><td>"+info.fullName+"</td></tr>" +
                   "<tr><td style=\"font-weight:bold\">Total Number of Trips</td><td>"+info.numTrips+"</td></tr>" +
                   "<tr><td style=\"font-weight:bold\">Number of Trips On Time</td><td>"+info.onTimeTrips+"</td></tr>" +
                   "<tr><td style=\"font-weight:bold\">On-Time Percentage</td><td>"+info.onTimePct+"%</td></tr>" +
                   "<tr><td style=\"font-weight:bold\">Total Omlet Dollars Earned</td><td>"+info.OMDEarned+" OMD</td></tr>" +
                   "</tbody></table>";
    $('#tableData').html(''); //Clear
    $('#tableData').html(HTMLCode);
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

//Temporary Database
var stats = [
    {
        "userName": "khan",
        "fullName": "Kevin Han",
        "numTrips": 50,
        "onTimeTrips": 39,
        "onTimePct": 78.0,
        "OMDEarned": 3900
    },
    {
        "userName": "gkho",
        "fullName": "Gabriel Kho",
        "numTrips": 40,
        "onTimeTrips": 35,
        "onTimePct": 87.5,
        "OMDEarned": 3500
    },
    {
        "userName": "jhdoe",
        "fullName": "John Doe",
        "numTrips": 36,
        "onTimeTrips": 27,
        "onTimePct": 75.0,
        "OMDEarned": 2700
    },
    {
        "userName": "jndoe",
        "fullName": "Jane Doe",
        "numTrips": 38,
        "onTimeTrips": 36,
        "onTimePct": 94.7,
        "OMDEarned": 3600
    },
    {
        "userName": "jsmith",
        "fullName": "John Smith",
        "numTrips": 150,
        "onTimeTrips": 10,
        "onTimePct": 6.7,
        "OMDEarned": 1000
    }
]