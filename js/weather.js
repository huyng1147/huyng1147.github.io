// http: //api.wunderground.com/api/1fa797835d7116aa/conditions/q/CA/San_Francisco.json
// http://api.wunderground.com/api/1fa797835d7116aa/geolookup/q/94107.json

const WU_APIKEY = "1fa797835d7116aa";
const WU_APIURL = "http://api.wunderground.com/api/";

// Shorthand for $( document ).ready()
$(function() {
    console.log("ready");
    getLocationByZipCode(42101);
});

$("#saveZipcodeButton").on("click", function(event) {
	/* Act on the event */
	console.log("saveZipcodeButton");
	getLocationByZipCode($("#zipcodeInput").val());
});

function getLocationByZipCode(zipcode) {
    $.ajax({
            type: "POST",
            url: WU_APIURL + WU_APIKEY + "/geolookup/q/" + zipcode + ".json",
            dataType: "json",
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
                } else {
                    console.log(result.location.l);
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
    });
}

function getCurrentConditionWeather(location) {
    $.ajax({
            type: "POST",
            url: WU_APIURL + WU_APIKEY + "/conditions" + location + ".json",
            dataType: "json",
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
                        "<div class='row'>" +
                        "<div class='col-md-4'>" + result.current_observation.display_location.full + "</div>" +
                        "<div class='col-md-4'>" + result.current_observation.weather + "</div>" + 
                        "<div class='col-md-4'>" + result.current_observation.temperature_string + "</div>" +
                        "</div>");
                    $("#weatherContent").append(
                        "<div class='row'>" +
                        	"<img src='" + result.current_observation.image.url + "'" + "class='img-rounded'>" +
                        "</div>");
                } else {
                	$("#weatherContent").empty();
                    $("#weatherContent").append(
                        "<div class='alert alert-warning alert-dismissible' role='alert'>" +
                        "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                        result.response.error.description +
                        "</div>");

                }
                $("#weatherModal").modal('hide');
            })

    .fail(function() {
    	$("#weatherContent").empty();
        $("#weatherContent").append(
            "<div class='alert alert-warning alert-dismissible' role='alert'>" +
            "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
            result.response.error.description +
            "</div>");
        $("#weatherModal").modal('hide');
    });
}
