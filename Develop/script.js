$(document).ready(function(){
    $( "#btn" ).click(function (event){
        event.preventDefault();
        
        //City name input
        const city = $("#cityInput").val().trim()

    
        // API key
        const APIKey = "3ad59a1b75ec925455fe5cb8139345fa";

        // Building URL to query current day weather database
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
            const location = response.name;
            const country = response.sys.country;
            const tempF = Math.round((response.main.temp-273.15)*9/5 + 32);
            const tempC = Math.round(response.main.temp-273.15);
            const humidity = response.main.humidity;
            const windSpeed = response.wind.speed;

            // Transfer content to HTML
            $(".city").text(location + ", " +country);
            $(".date").text(today);

            $(".temp").text("Temperature: " + tempF+ " °F /"+ tempC+ " °C");
            $(".humidity").text("Humidity: " +humidity+" %");
            $(".wind").text("Wind Speed: " + windSpeed+" MPH");

            console.log(response);

            // Building URL to query UV index database
            const queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="
            +response.coord.lat+"&lon="+response.coord.lon;
            $.ajax({
                url: queryURL2,
                method: "GET"
                })
                // We store UV retrieved data inside of an object called "response2"
                .then(function(response2) {
                    const uvIndex = response2.value;
                    // Transfer UV index to HTML
                    $(".uvIndex").text("UV index: " + uvIndex); 
                    console.log(response2);
                   
            });

        // Building URL to query current the 5 days forcast database
        const queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q="+ city+"&appid="+APIKey;
        $.ajax({
            url: queryURL3,
            method: "GET"
            })
            // We store UV retrieved data inside of an object called "response2"
            .then(function(response3) {
                 // Transfer 5 days forcast in HTML

                for (let i=1; i<6; i++){
                    let j = 3 + 8*(i-1) // each day have 8 records - picking up the 4rd one(index 3 at 12:00 PM)
                    let temp_F = Math.round((response3.list[j].main.temp-273.15)*9/5 + 32);
                    let temp_C = Math.round(response3.list[j].main.temp-273.15);
                    let hum = response3.list[j].main.humidity;
                    let dayI = "#day"+i;
                    $(dayI).html("<p>Temp: " + temp_F+ " °F /"+ temp_C+ " °C</P>");
                    $(dayI).append("<p>Humidity: " +hum+" %</P>");
                    console.log(j);
                    console.log(temp_F+ " °F /"+ temp_C);
                }
               // $(".uvIndex").text("UV index: " + response.wind.speed); 
               console.log(response3);

             });
        
            

        });
    });
});