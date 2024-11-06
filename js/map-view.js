// map-view.js

$(document).ready(function () {
    // Functionality for select all/deselect all buttons
    $('.select-all').on('click', function () {
        $(this).parent().next('ul').find('input[type="checkbox"]').prop('checked', true);
    });

    $('.deselect-all').on('click', function () {
        $(this).parent().next('ul').find('input[type="checkbox"]').prop('checked', false);
    });
});

// Initialize Leaflet map
const map = L.map('map').setView([36.56, 136.65], 13); // Initial coordinates for Kanazawa

// Add a basic tile layer (Google Maps can also be added with Leaflet)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
