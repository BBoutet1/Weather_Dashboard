## Weather Dashboard

This web application retrieves data from the [OpenWeather](https://openweathermap.org/api) Third-party API  to build a weather dashboard that runs in the browser and feature dynamically updated HTML and CSS.

weather data are retrieved from the API  for the city input. `localStorage`  is used to store search history.

## Used technologies

```
- HTML
- CSS (intentionnaly no framework)
- JavaScript
- jQuery 
- moment.js

```

## Functionalities

```

- When I search for a city, I am presented with current and future (5 days forecast) conditions for that city 
  which is added to the search history. 
  
- Wheather conditions data from the search are presented with the name of city, the date, an icon representation 
  of weather conditions, the temperature, the humidity, the wind wind speed and the UV index.
  
- UV index colore code indicates whether the conditions are favorable, moderate, or severe

- 5-day forecast displays, startig from next day: an icon representation of weather conditions,
  the temperature and the humidity.
  
- The city can be also selected by clicking on the search history

- The search history contains a maximum of 10 entries starting from the last search, without duplicates. Search
  history (local storage) can be cleared.

```

