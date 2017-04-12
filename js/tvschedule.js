// http: //api.wunderground.com/api/1fa797835d7116aa/conditions/q/CA/San_Francisco.json
// http://api.wunderground.com/api/1fa797835d7116aa/geolookup/q/94107.json

//http://api.tvmaze.com/schedule?country=US&date=2017-04-11

const TVMAZE_URL = "https://api.tvmaze.com/schedule?country=US&date=";

$(function() {
    console.log("ready");
    getScheduleCurrentDate();
});

 


function getScheduleCurrentDate() {
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (dd < 10) {
        dd = '0' + dd;
    }
    $.ajax({
            type: "GET",
            url: TVMAZE_URL + yyyy + '-' + mm + '-' + dd,
        })
    .done(
        function(result) {
            $("#tvschedule").empty();
            if (result.code == 0) {
                console.log("error");
            } else {
                for (var i = 0; i < result.length; i++) {
                    var show = result[i];
                    console.log(show);
                    $("#tvschedule").append(
                        '<div class="panel panel-default panel-primary">' +
                            '<div class="panel-heading">' +
                                '<h3 class="panel-title">' + show.show.name + '</h3>' +
                            '</div>' +
                            '<div class="panel-body">' +
                                '<div>Title: ' + show.name + '</div>' + 
                                '<div>Season: ' + show.season + '</div>' + 
                                '<div>Episode: ' + show.number + '</div>' + 
                            '</div>' +
                        '</div>')
                }
            }
        })
    .fail(function() {

    });
}

