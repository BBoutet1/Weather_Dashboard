$(document).ready(function(){
    const today = moment().format('LL'); // current date
    let city=""; // city name
    let history=[]; //search history array

     //Transfer date to html
     $(".date").text(today);

    //Retrieving previously saved search history
    history = JSON.parse(localStorage.getItem("histKey") || "[]");

    //Write history  in html 
    function historyToHtml(){
        if(history.length>0){
            $("table").empty();       
            for (let j=0; j<history.length; j++){
                $("table").append("<tr class=\"history\"><td id=\""+history[j]+"\">"+history[j]+"</td></tr>")
            }
        }
    }
    historyToHtml()

   

    //5-day forcecast dates
    for (let i=0; i<5; i++){
        let dayI = moment().add(i+1,'days'). format('MM/DD/YYYY')// add 1 day
        let dayId = "#day"+i;
        $(dayId).append("<h5>"+dayI+"<\h5>");   
    }
    
    //Submitting the city name from the form input
    $( "#btn" ).click(function (event){
        event.preventDefault();
        //Grabbing the city name from the input field
        city = $("input").val().trim();
        processRequest(city);
    });

    //Selecting the city name from the history
    $( "table" ).click(function (event){
        let id =event.target.id;
        let elmtId="#"+id;
        //City name selected in the history
        city =$(elmtId).text();
        processRequest(city);
    })


    //Processing acquiring and processing weather data
    function processRequest(city){
        // API key
        const APIKey = "3ad59a1b75ec925455fe5cb8139345fa";

        // Building URL to query current day weather database
        const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        city + "&appid="+ APIKey;

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
        url: queryURL,

            //Successfull ajax call
            success:ajaxSuccess,
            
            //Unsuccessfull ajax call 
            error: ajaxError,
        })   

        // We store all of the retrieved data inside of an object called "response"
        function ajaxSuccess(response) {
            console.log(response)
            const location = response.name;
            city = location // correct city name orthograph (try Lisboa for Lisbon)
            const country = response.sys.country;
            const tempF = Math.round((response.main.temp-273.15)*9/5 + 32); // Kelvin to Fahrenheit
            const tempC = Math.round(response.main.temp-273.15);  // Kelvin to Celcius
            const humidity = response.main.humidity;
            const windSpeed = response.wind.speed;
            const iconCode = response.weather[0].icon;
            const iconUrl = "http://openweathermap.org/img/wn/"+iconCode+"@2x.png";

            // Transfer content to HTML
            $(".city").text(location + ", " +country); //city name
            $("#image").remove(); // remove previous current weather icon
            $(".iconeNdate").append("<img id=\"image\" src=\""+iconUrl+"\"width=\"50px\" height=\"50px\" alt=\"\">");
            $(".temp").text("Temperature: " + tempF+ " °F /"+ tempC+ " °C");
            $(".humidity").text("Humidity: " +humidity+" %");
            $(".wind").text("Wind Speed: " + windSpeed+" MPH");

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
                    $(".uvIndex").html("UV index: <p class =\"value\">"+ uvIndex+"</p> " ); 
                    if (uvIndex<5) { // passed timeblocks
                        $(".value").addClass("favorable"); 
                    }
                    else if(uvIndex>5 && uvIndex>7){ // present timeblock
                        $(".value").addClass("moderate"); 
                    }  
                    else{ // future timeblock
                        $(".value").addClass("severe"); 
                    }
                    console.log(response2)   
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
                    for (let i=0; i<5; i++){
                        dayI = moment().add(i+1,'days'). format('MM/DD/YYYY')// add 1 day
                        dayId = "#day"+i;
                        const j = 8*i+3 // each day have 8 records (every 3hours) - picking up the 4rd one(index 3 at 12:00 PM)
                        const temp_F = Math.round((response3.list[j].main.temp-273.15)*9/5 + 32); // Kelvin to Fahrenheit
                        const temp_C = Math.round(response3.list[j].main.temp-273.15); // Kelvin to Celcius
                        const hum = response3.list[j].main.humidity;
                        const iconCode3 = response3.list[j].weather[0].icon;
                        const iconUrl3 = "http://openweathermap.org/img/wn/"+iconCode3+"@2x.png";
                        $(dayId).empty();
                        $(dayId).append("<h5>"+dayI+"<\h5>");
                        $(dayId).append("<img src=\""+iconUrl3+"\"width=\"50px\" height=\"50px\" alt=\"\">");
                        $(dayId).append("<p class =\"tempFive\">Temp: " + temp_F+ " °F /"+ temp_C+ " °C<br> Humidity: " +hum+" %</P>"); 

                    }

                });
            
 

           
    

            //Check if current city already in the history
            var index = history.indexOf(city); 

            if (index >-1){
                //remove the duplicate if it exists
                history.splice(index,1);
            }

            //No more than 10 entries in search history.
            while( history.length > 9){
                history.splice(history.length-1,1);
            }

            // Add the city to search history in the first position
            history.splice(0,0,city); 

            //Local storage of history array
            localStorage.setItem("histKey", JSON.stringify(history))
            
            //Write in html table
            historyToHtml()
            
        };

        function ajaxError(){
            //If city input not in the database
            if(city!==""){
                $(".city").text("City of "+city+ " not found");
            }
            $(".temp").text("Temperature:");
            $(".humidity").text("Humidity:");
            $(".wind").text("Wind Speed:");
            $(".uvIndex").text("UV index:"); 
            $("img").remove();
            $(".tempFive").remove();
        }
        
    }

      //  Clear search History
      $( ".clearHistory" ).click(function (){
        localStorage.removeItem("histKey");
        history=[];
        $("table").html("<tr><td>No history</td></tr>");
     });
});