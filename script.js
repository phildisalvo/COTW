// script.js
// Fetch country data and update the webpage

document.addEventListener("DOMContentLoaded", async function() {
    const countryData = await fetchCountryOfTheWeek();
    if (countryData) {
        updatePage(countryData);
    }
});

async function fetchCountryOfTheWeek() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();
        const selectedCountry = countries[Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7)) % countries.length];
        return selectedCountry;
    } catch (error) {
        console.error("Error fetching country data:", error);
        return null;
    }
}

function updatePage(country) {
    document.getElementById("country-name").innerText = country.name.common;
    document.getElementById("flag").src = country.flags.png;
    document.getElementById("population").innerText = `Population: ${country.population.toLocaleString()}`;
    document.getElementById("language").innerText = `Language: ${Object.values(country.languages).join(", ")}`;
    
    // Load Google Map
    initMap(country.latlng[0], country.latlng[1]);
}

function initMap(lat, lng) {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng },
        zoom: 4,
    });

    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: "Country Location",
    });
}