document.getElementById('quote-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Quote request submitted!");
    // Here you would send the data to a backend or use an API to handle the request
});

document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Appointment scheduled!");
    // Here you would send the data to a backend or use an API to handle the appointment
});
