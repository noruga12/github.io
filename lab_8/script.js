/* eslint-disable max-len */

/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

/*
  ## Utility Functions
    Under this comment place any utility functions you need - like an inclusive random number selector
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/

function injectHTML(list, map) {
  console.log("fired injectHTML");
  const rightBoxDiv = document.getElementById("right_section_box");
  let result = "";

  // Leaflet can be a bit old-fashioned.
  // Here's some code to remove map markers.
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });
  console.log(map);
  list.forEach((res) => {
    result += `<li>${res.name}. Location: ${res.location}</li>`;
    new L.Marker(L.latLng(res.geoLocation[1], res.geoLocation[0])).addTo(map);
  });

  rightBoxDiv.setHTML(`
    <div>
          <ul>
              ${result}
          </ul>
    </div>`);
}

function processRestaurants(list) {
  console.log("fired restaurants list");

  const result = [...Array(15)].map((u) => ({}));
  let n = 0;
  const len = list.length;
  const taken = new Set();

  console.log(list[0].geocoded_column_1.coordinates);
  while (n < 15) {
    const i = Math.floor(Math.random() * len);

    if (taken.has(i)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    taken.add(i);
    result[n] = {
      name: list[i].name,
      category: list[i].category,
      location: list[i].address_line_1,
      geoLocation: list[i].geocoded_column_1.coordinates,
    };

    // eslint-disable-next-line no-plusplus
    n++;
  }

  return result;
}

async function mainEvent() {
  /*
      ## Main Event
        Separating your main programming from your side functions will help you organize your thoughts
        When you're not working in a heavily-commented "learning" file, this also is more legible
        If you separate your work, when one piece is complete, you can save it and trust it
    */

  let maxBounds = [
    [5.49955, -167.276413], //Southwest
    [83.162102, -52.23304], //Northeast
  ];

  const map = L.map("map", {
    center: [0, 0],
    zoom: 0,
    maxBounds: maxBounds,
  }).fitBounds(maxBounds);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // the async keyword means we can make API requests
  const form = document.querySelector(".main_form"); // get your main form so you can do JS with it
  const submit = document.querySelector('button[type="submit"]'); // get a reference to your submit button
  submit.style.display = "none"; // let your submit button disappear

  /*
      Let's get some data from the API - it will take a second or two to load
      This next line goes to the request for 'GET' in the file at /server/routes/foodServiceRoutes.js
      It's at about line 27 - go have a look and see what we're retrieving and sending back.
     */
  const results = await fetch("https://data.princegeorgescountymd.gov/", {
    method: 'GET',
    headers: {
      'Content-type' : 'application/json'
    }});
  const arrayFromJson = await results.json(); // here is where we get the data from our request as JSON

  /*
      Below this comment, we log out a table of all the results using "dot notation"
      An alternate notation would be "bracket notation" - arrayFromJson["data"]
      Dot notation is preferred in JS unless you have a good reason to use brackets
      The 'data' key, which we set at line 38 in foodServiceRoutes.js, contains all 1,000 records we need
    */
  console.table(arrayFromJson.data);

  // in your browser console, try expanding this object to see what fields are available to work with
  // for example: arrayFromJson.data[0].name, etc
  console.log(arrayFromJson.data[0]);

  // this is called "string interpolation" and is how we build large text blocks with variables
  console.log(
    `${arrayFromJson.data[0].name} ${arrayFromJson.data[0].category}`
  );

  // This IF statement ensures we can't do anything if we don't have information yet
  if (arrayFromJson.data?.length > 0) {
    let restaurantList = [];

    // the question mark in this means "if this is set at all"
    submit.style.display = "block"; // let's turn the submit button back on by setting it to display as a block when we have data available

    // And here's an eventListener! It's listening for a "submit" button specifically being clicked
    // this is a synchronous event event, because we already did our async request above, and waited for it to resolve
    form.addEventListener("submit", (submitEvent) => {
      // This is needed to stop our page from changing to a new URL even though it heard a GET request
      submitEvent.preventDefault();

      // This constant will have the value of your 15-restaurant collection when it processes
      restaurantList = processRestaurants(arrayFromJson.data);

      // And this function call will perform the "side effect" of injecting the HTML list for you
      injectHTML(restaurantList, map);

      // By separating the functions, we open the possibility of regenerating the list
      // without having to retrieve fresh data every time
      // We also have access to some form values, so we could filter the list based on name
    });

    const inputElem = document.querySelector("input");

    inputElem.addEventListener("input", (e) => {
      e.preventDefault();

      injectHTML(
        restaurantList.filter((res) =>
          res.name.toLowerCase().includes(inputElem.value.toLowerCase())
        ),
        map
      );
    });
  }
}

/*
    This last line actually runs first!
    It's calling the 'mainEvent' function at line 57
    It runs first because the listener is set to when your HTML content has loaded
  */
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
