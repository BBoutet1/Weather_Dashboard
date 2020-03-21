$(document).ready(function(){
    $( "#btn" ).click(function (event){
        event.preventDefault();
        
        let city = $("#cityInput").val().trim()

       // api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
    
        // This is our API key
        var APIKey = "3ad59a1b75ec925455fe5cb8139345fa";

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        city + "&appid="+ APIKey;

        console.log(queryURL)

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
        url: queryURL,
        method: "GET"
        })
        // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

    
            console.log("Wind Speed: " + response.wind.speed);
            console.log("Humidity: " + response.main.humidity);
            console.log("Temperature (F): " + tempF);
        });
    });
});