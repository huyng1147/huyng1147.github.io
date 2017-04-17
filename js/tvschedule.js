// http: //api.wunderground.com/api/1fa797835d7116aa/conditions/q/CA/San_Francisco.json
// http://api.wunderground.com/api/1fa797835d7116aa/geolookup/q/94107.json

//http://api.tvmaze.com/schedule?country=US&date=2017-04-11

const TVMAZE_URL = "https://api.tvmaze.com/schedule?country=US&date=";
const TVMAZE_URL_EPISODE = "https://api.tvmaze.com/shows/";

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
    
    $(".todayheading").text(getHeadingDateStringFromDate(currentday));
    getScheduleCurrentDate(getDateStringFromDate(currentday));
    // loadGrid();

    $("#preBtn").click(function(event) {
        getSchedulePreDate();
    });

    $("#nextBtn").click(function(event) {
        getScheduleNextDate();
    });

    $(".todayheading").click(function(event) {
        console.log("aaaa");
        $("#tvschedule").removeClass("hidden");
        $("#tvshow").addClass("hidden");
        getScheduleCurrentDate(currentday);
        $(".todayheading").text(getHeadingDateStringFromDate(currentday));
    });
});



function getScheduleNextDate() {
    $("#tvschedule").removeClass("hidden");
    $("#tvshow").addClass("hidden");
    currentday.setDate(currentday.getDate() + 1);
    $(".todayheading").text(getHeadingDateStringFromDate(currentday));
    getScheduleCurrentDate(getDateStringFromDate(currentday));

}

function getSchedulePreDate() {
    $("#tvschedule").removeClass("hidden");
    $("#tvshow").addClass("hidden");
    currentday.setDate(currentday.getDate() - 1);
    $(".todayheading").text(getHeadingDateStringFromDate(currentday));
    getScheduleCurrentDate(getDateStringFromDate(currentday));
}

function getShowEpisode(showId) {
    $("#tvshow").removeClass("hidden");
    $.ajax({
            type: "GET",
            url: TVMAZE_URL_EPISODE + showId + "/episodes"
        })
        .done(
            function(result) {
                $("#tvshow").empty();
                if (result.code == 0) {
                    console.log("error");
                } else {
                    for (var i = 0; i < result.length; i++) {
                        var show = result[i];
                        var image = show.image;
                        if (image != null) {
                            image = image.original;
                        }
                        else {
                            image = "";
                        }
                        var shownumber;
                        if (show.number < 10) {
                            shownumber = '0' + show.number;
                        } else {
                            shownumber = show.number;
                        }
                        var showseason;
                        if (show.season < 10) {
                            showseason = '0' + show.season;
                        } else {
                            showseason = show.season;
                        }
                        var $items = $('<div class="col-sm-12">' +
                                    '<div id="' + show.id +'" class="panel panel-primary" style="margin-bottom: 10px; margin-top: 10px;">' +
                                        '<div class="panel-heading">' +
                                            '<h3 class="panel-title">E' + shownumber + 'S' + showseason + ' - ' + show.name + '</h3>' +
                                        '</div>' +
                                        '<div class="panel-body">' +
                                            '<div class="col-lg-8">' +
                                                '<h3>' + show.name + '</h2>' +
                                                // '<h5>Season: ' + show.season + ' - Episode: ' + show.number + '</h5>' +
                                                '<h5>Air Time: ' + show.airtime + '</h5>' +
                                                '<h5>Air Day: ' + show.airdate + '</h5>' +
                                                '<h5>Runtime: ' + show.runtime + ' min</h5>' +
                                                '<div class="summary" style="font-size:16px;"><strong>Summary:</strong> ' + show.summary + '</div>' +
                                            '</div>' +
                                            '<div class="col-lg-4">' +
                                                '<img class="img-responsive" src="' + image + '"></img>' +
                                            '</div>' + 
                                        '</div>' +
                                    '</div>' +
                                '</div>');
                        $("#tvshow").append($items);
                    }
                }
            })
        .fail(function() {

        });
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
                                rating = "N/A";
                            }
                            var summary = show.summary;
                            if (summary == null) {
                                summary = "N/A";
                            }
                            var imdblink = show.show.externals.imdb;
                            if (imdblink == null) {
                                imdblink = "#";
                            }
                            else {
                                imdblink = "http://www.imdb.com/title/" + imdblink;
                            }
                            var $items = $('<div class="col-sm-6">' +
                                    '<div id="' + show.id +'" class="panel panel-primary" style="margin-bottom: 10px; margin-top: 10px;">' +
                                        '<div class="panel-heading">' +
                                            '<h3 class="panel-title">' + show.show.name + '</h3>' +
                                        '</div>' +
                                        '<div class="panel-body">' +
                                            '<div class="col-lg-8">' +
                                                '<h2>' + show.name + '</h2>' +
                                                '<h4>Season: ' + show.season + ' - Episode: ' + show.number + '</h4>' +
                                                '<h4>Air Time: ' + show.show.schedule.time + '</h4>' +
                                                '<h4>Channel: ' + show.show.network.name + '</h4>' +
                                                '<h4>Rating: ' + rating + '</h4>' +
                                                '<a type="button" class="btn btn-link" style="padding-left: 0px; font-size: 20px;" href="' + show.url + '" target="_blank"><i class="glyphicon glyphicon-link"></i> TV MAZE</a>' +
                                                '<a type="button" class="btn btn-link" style="padding-left: 0px; font-size: 20px;" href="' + imdblink + '" target="_blank"><i class="glyphicon glyphicon-link"></i> IMDB</a>' +
                                                '<div><a type="button" class="btn btn-link episodeBtn" id="' + show.show.id + '" style="padding-left: 0px; font-size: 20px;" href="javascript:void(0);">List of Episodes</a></div>' +
                                                '<div class="summary" style="font-size:20px;"><strong>Summary:</strong> ' + summary + '</div>' +
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
                    $(".btn.btn-link.episodeBtn").click(function(event) {
                        $("#tvschedule").addClass("hidden");
                        getShowEpisode(this.id);
                    });
                }
            })
        .fail(function() {

        });
}
