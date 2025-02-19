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
        const response = await fetch("countries.json");
        const countries = await response.json();
        
        // Get current week of the year
        const weekNumber = new Date().getWeekNumber();
        
        // Select the country based on the week number (looping over the list)
        const selectedCountry = countries[weekNumber % countries.length];

        return fetchCountryDetails(selectedCountry.code);
    } catch (error) {
        console.error("Error fetching country list:", error);
        return null;
    }
}

// Fetch full country details from REST Countries API
async function fetchCountryDetails(countryCode) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const countryData = await response.json();
        return countryData[0]; // API returns an array
    } catch (error) {
        console.error("Error fetching country details:", error);
        return null;
    }
}

// Get week number helper function
Date.prototype.getWeekNumber = function () {
    const firstJan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - firstJan) / 86400000) + firstJan.getDay() + 1) / 7);
};

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

