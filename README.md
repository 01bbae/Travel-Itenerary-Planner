# Travel-Itinerary-Planner

## BJ Bae, Tyler Kay

### Description

We wanted to create a platform that would allow people to create their own travel itineraries with ease. Google Maps is great for navigating from one place to another, but it is not the best for creating extended travel plans. For this reason, we combined the routing features that Google Maps offers as well the rating features that Yelp provides. The combination of both platforms allow users to create a travel itinerary with ease. In this project, we used React, Node, Express, and mySQL.

### Screenshots

![Alt text](/src/registration_page.jpg?raw=true "Registration Page")
![Alt text](/src/login_page.jpg?raw=true "Login Page")
![Alt text](/src/main-page.jpg?raw=true "Main Page")
![Alt text](/src/saved_routes_page.jpg?raw=true "Saved Routes Page")

### Setup:

1. Head over to https://developers.google.com/maps to setup a Google Maps API key.
2. After creating an Google Maps Platform account, create a new project, and enable the Directions, Maps Javascript, and Places API
3. Head to the Travel-Itinerary-Planner/frontend directory and create a .env file. In this file, add in your API credentials in this format: REACT_APP_GOOGLE_MAPS_API_KEY={INSERT API KEY}
4. In the Travel-Itinerary-Planner/server directory, create a .env file. In this file, add in your mysql password in this format: MYSQL_PASSWORD={INSERT PASSWORD}
5. In both the frontend and server directory, type in "npm ci".

### How to run the web application:

1. Change into the server directory and run npm start.
2. Change into the frontend directory and run npm start (or npm run dev for nodemon).

### References:

- https://www.w3schools.com/nodejs/nodejs_mysql.asp
- https://developers.google.com/maps/documentation/javascript/directions
- https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
- https://github.com/sidorares/node-mysql2#history-and-why-mysql2
- https://youtu.be/9e-5QHpadi0
- https://youtu.be/s4n_x5B58Dw
- https://www.youtube.com/watch?v=iP3DnhCUIsE
  - Google Maps Autocomplete/route/marker implementation
- https://www.npmjs.com/package/@react-google-maps/api
- https://www.youtube.com/watch?v=Y-XW9m8qOis
  - Login page
