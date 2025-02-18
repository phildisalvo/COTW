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

    // Load Leaflet Map
    const map = L.map('map').setView([country.latlng[0], country.latlng[1]], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([country.latlng[0], country.latlng[1]]).addTo(map)
        .bindPopup(`<b>${country.name.common}</b>`)
        .openPopup();

    // Load landmark image from local storage
    loadLocalLandmarkImage(country.name.common);
}

function loadLocalLandmarkImage(countryName) {
    const formattedName = countryName.toLowerCase().replace(/\s+/g, "-"); // Convert to lowercase and replace spaces with "-"
    const imagePath = `landmarks/${formattedName}.jpg`; // Adjust file extension if needed
    document.getElementById("landmark").src = imagePath;
    document.getElementById("landmark").onerror = function() {
        console.warn("No local landmark image found, using placeholder.");
        this.src = "landmarks/default.jpg"; // Provide a default fallback image
    };
}

