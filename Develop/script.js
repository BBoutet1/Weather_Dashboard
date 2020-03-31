$(document).ready(function(){

    // current date
    const today = moment().format('LL'); 

    //City input value
    let city="";

    //Sarch history table
    let history=[];

    //Transfering date to html
     $(".date").text(today);

    //Retrieving previously saved search history table
    history = JSON.parse(localStorage.getItem("histKey") || "[]");

    //Function to write history table in html 
    function historyToHtml(){
        if(history.length>0){
            $("table").empty();       
            for (let j=0; j<history.length; j++){
                $("table").append("<tr class=\"history\"><td id=\""+history[j]+"\">"+history[j]+"</td></tr>")
            }
        }
    }
    historyToHtml()

    //Defining and wrintin the 5-day forcecast dates in html
    for (let i=0; i<5; i++){
        let dayI = moment().add(i+1,'days'). format('MM/DD/YYYY')// add 1 day
        let dayId = "#day"+i;
        $(dayId).append("<h5>"+dayI+"<\h5>");   
    }
    
    //Submitting the written city input
    $( "#btn" ).click(function (event){

        event.preventDefault();

        //Grabbing the city name from the input field
        city = $("input").val().trim();

        //Retrieving and processing data from API
        processRequest(city);
    });

    //Submitting the city name by selecting in the search history
    $( "table" ).click(function (event){

        //History cities names are history rows id
        city =event.target.id;

        //Retrieving and processing data from API
        processRequest(city);
    

    })


    //Function for retrieving and processing weather data
    function processRequest(city){

        // API key
        const APIKey = "3ad59a1b75ec925455fe5cb8139345fa";

        // Building URL to query current day weather database
        const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        city + "&appid="+ APIKey;

       

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
            url: queryURL,

            //Successfull ajax call function
            success:ajaxSuccess,
            
            //Unsuccessfull ajax call function
            error: ajaxError,
        });   

        // If successful We store all of the retrieved data inside of an object called "response"
        function ajaxSuccess(response) {
            city = response.name; // city name from API
            const country = response.sys.country; // Country code
            const tempF = Math.round((response.main.temp-273.15)*9/5 + 32); // Kelvin to Fahrenheit
            const tempC = Math.round(response.main.temp-273.15);  // Kelvin to Celcius
            const humidity = response.main.humidity;
            const windSpeed = response.wind.speed;
            const iconCode = response.weather[0].icon;
            const iconUrl = "http://openweathermap.org/img/wn/"+iconCode+"@2x.png"; // weather icon image

            // Transfer content to HTML
            $(".city").text(city + ", " +country); //city name
            $("#image").remove(); // remove previous current weather icon
            $(".iconeNdate").append("<img id=\"image\" src=\""+iconUrl+"\"width=\"50px\" height=\"50px\" alt=\"\">"); // weather icon
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
                    
                    //UV weathe condition color code
                    if (uvIndex<5) {
                        $(".value").addClass("favorable"); 
                    }
                    else if(uvIndex>11){ // present timeblock
                        $(".value").addClass("severe"); 
                    }  
                    else{ // future timeblock
                        $(".value").addClass("moderate"); 
                }
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
                        const j = 8*i+3 // each day have 8 records (every 3hours) - picking up the 4rd record (index 3 at 12:00 PM)
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
            //Removing current requested city from search history to prevent duplicate
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

            //Write search history in html table
            historyToHtml();
        };

        //Function if the request is uncessfull (city not in database)
        function ajaxError(){
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