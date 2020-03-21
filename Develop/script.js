$(document).ready(function(){
    $( "#btn" ).click(function (event){
        event.preventDefault();
        
        //City name input
        const city = $("#cityInput").val().trim()

    
        // This is our API key
        const APIKey = "3ad59a1b75ec925455fe5cb8139345fa";

        // Here we are building the URL we need to query the database
        const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        city + "&appid="+ APIKey;

        //current date
        var today = moment().format('LL')

    
        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
        url: queryURL,
        method: "GET"
        })
        // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {

           
            

            // Transfer content to HTML
            $(".city").html("<h2>" + response.name + ", " +response.sys.country+"</h2>");
            $(".city").append("<h4>" +today + "</h4>");

            $(".temp").text("Temperature: " + response.main.temp+ " °F");
            $(".humidity").text("Humidity: " + response.main.humidity+" %");
            $(".wind").text("Wind Speed: " + response.wind.speed+" MPH");
            // Uv index data
            const queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="
            +response.coord.lat+"&lon="+response.coord.lon;
            $.ajax({
                url: queryURL2,
                method: "GET"
                })

                .then(function(response2) {
                    console.log(response2);
                    $(".uvIndex").text("UV index: " + response.wind.speed);
                
                });
          
            

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

        });
    });
});