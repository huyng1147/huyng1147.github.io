// http: //api.wunderground.com/api/1fa797835d7116aa/conditions/q/CA/San_Francisco.json
// http://api.wunderground.com/api/1fa797835d7116aa/geolookup/q/94107.json

const WU_APIKEY = "1fa797835d7116aa";
const WU_APIURL = "https://api.wunderground.com/api/";

var currentZipcodeLocation;


$("#saveZipcodeButton").on("click", function(event) {
    /* Act on the event */
    console.log("saveZipcodeButton");
    currentZipcodeLocation = $("#zipcodeInput").val();
    getLocationByZipCode(currentZipcodeLocation);
    $("#weatherModal").modal('hide');
});

$('#weatherModal').on('shown.bs.modal', function() {
    $('#zipcodeInput').focus()
});

$('#refreshWeatherButton').on('click', function(event) {
    $('#refreshWeatherButton').find('span').addClass('glyphicon-refresh-animate');
    if(currentZipcodeLocation == null) {
        //Load Bowling Green, KY zipcode
        currentZipcodeLocation = 42101;
    }
    getLocationByZipCode(currentZipcodeLocation);
});

function getLocationByZipCode(zipcode) {
    $.ajax({
            type: "POST",
            url: WU_APIURL + WU_APIKEY + "/geolookup/q/" + zipcode + ".json",
            dataType: "jsonp",
            contentType: "application/json",
            data: JSON.stringify({})
        })
        .done(
            function(result) {
                $("#weatherContent").empty();
                if (result.response.error != null) {
                    $("#weatherContent").append(
                        "<div class='alert alert-warning alert-dismissible' role='alert'>" +
                        "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                        result.response.error.description +
                        "</div>");
                    $("#weatherModal").modal('hide');
                    $('#refreshWeatherButton').find('span').removeClass('glyphicon-refresh-animate');

                } else {
                    console.log(result.location);
                    getCurrentConditionWeather(result.location.l);
                }
            })

    .fail(function() {
        $("#weatherContent").empty();
        $("#weatherContent").append(
            "<div class='alert alert-warning alert-dismissible' role='alert'>" +
            "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
            result.response.error.description +
            "</div>");
        $("#weatherModal").modal('hide');
        $('#refreshWeatherButton').find('span').removeClass('glyphicon-refresh-animate');
    });
}

function getCurrentConditionWeather(location) {
    $.ajax({
            type: "POST",
            url: WU_APIURL + WU_APIKEY + "/conditions" + location + ".json",
            dataType: "jsonp",
            contentType: "application/json",
            data: JSON.stringify({})
        })
        .done(
            function(result) {
                console.log(result);
                if (result.current_observation != null) {
                    $("#weatherContent").empty();
                    console.log(result.current_observation);
                    $("#weatherContent").append(
                        "<img class='' src='" + result.current_observation.icon_url + "'>" +
                        "<h4 class=''>" + result.current_observation.weather + "</h4>" +
                        "<h3 class=''>" + result.current_observation.temperature_string + "</h3>");
                    $("#weatherContent").append(
                        "<div class='row'>" +
                        "<img src='" + result.current_observation.image.url + "'" + "class='img-rounded'>" +
                        "</div>");
                    $("#weatherHeading").text(result.current_observation.display_location.full);
                } else {
                    $("#weatherContent").empty();
                    $("#weatherContent").append(
                        "<div class='alert alert-warning alert-dismissible' role='alert'>" +
                        "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                        result.response.error.description +
                        "</div>");
                    $("#weatherHeading").text("Weather");
                }
                $('#refreshWeatherButton').find('span').removeClass('glyphicon-refresh-animate');
            })

    .fail(function() {
        console.log("getCurrentConditionWeather failed");
        $('#refreshWeatherButton').find('span').removeClass('glyphicon-refresh-animate');
    });
}
