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
    
    const map = L.map('map').setView([country.latlng[0], country.latlng[1]], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([country.latlng[0], country.latlng[1]]).addTo(map)
        .bindPopup(`<b>${country.name.common}</b>`)
        .openPopup();

    fetchLandmarkImage(country.name.common);
}

async function fetchLandmarkImage(countryName) {
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${countryName}`);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            document.getElementById("landmark").src = data.items[0].thumbnail.source;
        }
    } catch (error) {
        console.error("Error fetching landmark image:", error);
    }
}