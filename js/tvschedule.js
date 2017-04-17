// http: //api.wunderground.com/api/1fa797835d7116aa/conditions/q/CA/San_Francisco.json
// http://api.wunderground.com/api/1fa797835d7116aa/geolookup/q/94107.json

//http://api.tvmaze.com/schedule?country=US&date=2017-04-11

const TVMAZE_URL = "https://api.tvmaze.com/schedule?country=US&date=";

var currentday;
var $gridshow = $("#tvschedule");

function getDateStringFromDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (dd < 10) {
        dd = '0' + dd;
    }
    return yyyy + '-' + mm + '-' + dd;
}

function getHeadingDateStringFromDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (dd < 10) {
        dd = '0' + dd;
    }
    return mm + "/" + dd + "/" + yyyy;
}

$(function() {
    console.log("ready tv");
    var date = new Date();
    currentday = date;
    
    $("#todayheading").text(getHeadingDateStringFromDate(currentday));
    getScheduleCurrentDate(getDateStringFromDate(currentday));
    // loadGrid();

    $("#preBtn").click(function(event) {
        getSchedulePreDate();
    });

    $("#nextBtn").click(function(event) {
        getScheduleNextDate();
    });
});



function getScheduleNextDate() {
    currentday.setDate(currentday.getDate() + 1);
    $("#todayheading").text(getHeadingDateStringFromDate(currentday));
    getScheduleCurrentDate(getDateStringFromDate(currentday));

}

function getSchedulePreDate() {
    currentday.setDate(currentday.getDate() - 1);
    $("#todayheading").text(getHeadingDateStringFromDate(currentday));
    getScheduleCurrentDate(getDateStringFromDate(currentday));
}


function getScheduleCurrentDate(today) {
    $gridshow.masonry({
        transitionDuration: '0.4s',
        initLayout: false
    });

    $.ajax({
            type: "GET",
            url: TVMAZE_URL + today
        })
        .done(
            function(result) {
                $("#tvschedule").empty();
                if (result.code == 0) {
                    console.log("error");
                } else {
                    for (var i = 0; i < result.length; i++) {
                        var show = result[i];
                        if (show.show.type == "Scripted") {
                            var rating = show.show.rating.average;
                            if (rating == null) {
                                rating = "N/A"
                            }
                            var summary = show.summary;
                            if (summary == null) {
                                summary = "N/A"
                            }
                            var $items = $('<div class="col-sm-4">' +
                                    '<div class="panel panel-primary" style="margin-bottom: 10px;">' +
                                        '<div class="panel-heading">' +
                                            '<h3 class="panel-title">' + show.show.name + '</h3>' +
                                        '</div>' +
                                        '<div class="panel-body">' +
                                            '<div class="col-lg-8">' +
                                                '<div>Title: ' + show.name + '</div>' +
                                                '<div>Season: ' + show.season + '</div>' +
                                                '<div>Episode: ' + show.number + '</div>' +
                                                '<div>Time: ' + show.show.schedule.time + '</div>' +
                                                '<div>Channel: ' + show.show.network.name + '</div>' +
                                                '<div>Rating: ' + rating + '</div>' +
                                                '<a type="button" class="btn btn-link" style="padding-left: 0px;" href="' + show.url + '" target="_blank">Link</a>' +
                                                '<div>Summary: ' + summary + '</div>' +
                                            '</div>' +
                                            '<div class="col-lg-4">' +
                                                '<img class="img-responsive" src="' + show.show.image.original + '"></img>' +
                                            '</div>' + 
                                        '</div>' +
                                    '</div>' +
                                '</div>');
                            $gridshow.append($items).masonry('prepended', $items);
                        }
                    }
                    $gridshow.masonry();
                }
            })
        .fail(function() {

        });
}
