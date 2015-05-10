//change event on input
$(document).ready(function(){
    var input = $("#city");
    input.focus();
    var errorMessage = $("div#noLocations");
    var selectedLocation = $("div#selectedLocation");
    var temperature = $("div#weatherTemperature");
    var description = $("div#weatherDescription");
    var list = $("div#locationsList ul");
    function clearResult(){
        selectedLocation.html("");
        temperature.html("");
        description.html("");
        description.removeClass();
    };
    function clearError(){
        errorMessage.html("");
    };
    function clearList(){
        list.html("");
    };
    function clearAll (){
        input.val("");
        clearResult();
        clearError();
        clearList();
    };
    function locationsUS(locations) {
        var result = [ ];
        for(var i = 0; i < locations.length; i++) {
            if(locations[i].AdministrativeArea.CountryID == "US") {
                result.push(locations[i]);
            }
        }
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
                 clearList();
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
                $(selectedLocation).html(location.EnglishName + ", " + location.AdministrativeArea.EnglishName
                    + " " + location.PrimaryPostalCode);
                $(description).html(weathers[0].WeatherText);
                $(temperature).html(weathers[0].Temperature.Imperial.Value + " " + "degrees F");
                var weatherClass = weathers[0].WeatherText.toLowerCase().replace(/\s+/g, "-")
                    .replace(".", " ");
                $(description).removeClass().addClass("weather").addClass(weatherClass);
                console.log(weathers, weatherClass);
            }
        });
    }
    input.focus(clearAll);
    input.click(clearAll);
    input.change(function(){
        //make an ajax call
        //request to accuweather
        clearError();
        clearList();
        clearResult();
        var value = input.val();
        $.ajax({
            url: "http://apidev.accuweather.com/locations/v1/search",
            dataType: "json",
            data: {
                q: value,
                apikey: "meSocYcloNe"
            },
            crossDomain: true,
            //handler for the success event
            success: function(locations) {
                locations = locationsUS(locations);
                if (locations.length == 1) {
                    getWeather(locations[0]);
                } else if (locations.length == 0){
                    $(errorMessage).html("no locations found");
                } else {
                    renderLocations(locations);
                }
            },
            error: function(){
            }
        });
    });
});




