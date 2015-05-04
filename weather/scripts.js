//change event on input
$(document).ready(function(){
    var input = $('#city');
    var list = $("div#locationsList ul");
    function locationsUS(locations) {
        var result = [ ];
        for(var i = 0; i < locations.length; i++) {
            if(locations[i].AdministrativeArea.CountryID == "US") {
                result.push(locations[i]);
            }
        }
        console.log(result);
        return result;
    }
    function renderLocations(locations){
         for (var i = 0; i < locations.length; i++) {
             var location = locations[i];
             var li = $('<li></li>').appendTo(list);
             var a = $('<a href="#" data-index="' + i + '">' + locations[i].EnglishName + ", "
                + locations[i].AdministrativeArea.EnglishName + " " + locations[i].AdministrativeArea.CountryID + " "
                + locations[i].PrimaryPostalCode + '</a>').appendTo(li);

             a.click(function(){
                 var index = $(this).data('index');
                 getWeather(locations[index]);
                 return false;
             });
         }
    }
    function getWeather(location) {
        $.ajax({
            url: "http://apidev.accuweather.com/currentconditions/v1/" + location.Key + ".json",
            dataType: "json",
            data: {
                language: "en",
                apikey: "meSocYcloNe"
            },
            crossDomain: true,
            success: function(weathers) {
                $("div#selectedLocation").html(location.EnglishName + ", " + location.AdministrativeArea.EnglishName
                    + " " + location.PrimaryPostalCode);
                $("div#weatherDescription").html(weathers[0].WeatherText);
                $("div#weatherTemperature").html(weathers[0].Temperature.Imperial.Value + " " + "degrees F");
                var weatherClass = weathers[0].WeatherText.toLowerCase().replace(" ", "-");

                $("div#weatherDescription").removeClass().addClass(weatherClass);
                //console.log(weathers, weatherClass);
            }
        });
    }
    input.change(function(event){ //what is change doing, how get value? -> currentTarget -> value
        //make an ajax call
        //request to accuweather
        var value = input.val();
        $.ajax({
            url: "http://apidev.accuweather.com/locations/v1/search",
            dataType: "json",
            data: {
                q: value,
                apikey: "meSocYcloNe"
            },
            crossDomain: true,
            success: function(locations) {                  //handler for the success event
                locations = locationsUS(locations);
                if (locations.length == 1) {
                    getWeather(locations[0]);
                } else if (locations.length == 0){
                    $("div#selectedLocation").html("no locations found");
                } else {
                    renderLocations(locations);
                }
            },
            error: function(){
            }
        });
    });
});



