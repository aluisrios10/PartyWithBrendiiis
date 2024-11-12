document.addEventListener('DOMContentLoaded', function() {
    // Quote form submission
    document.getElementById('quote-form').addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const eventType = document.getElementById('event-type').value;
        const details = document.getElementById('details').value;
        const inspirationImage = document.getElementById('inspiration-image').files[0];

        // Create a FormData object
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('eventType', eventType);
        formData.append('details', details);

        // If an image is uploaded, append it to the form data
        if (inspirationImage) {
            formData.append('inspiration-image', inspirationImage);
        }

        // Send data to the back-end using fetch
        fetch('/quote', {
            method: 'POST',
            body: formData, // Send the FormData object
        })
        .then(response => response.text())
        .then(data => {
            alert('Quote request submitted!');
            console.log(data); // Log server response for debugging

            // Reset the form fields after submission
            document.getElementById('quote-form').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting quote');
        });

    });
});

// Appointment form submission
document.addEventListener('DOMContentLoaded', function() {
    // Appointment form submission
    document.getElementById('appointment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('app-name').value;
        const email = document.getElementById('app-email').value;
        const phone = document.getElementById('app-phone').value;
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;  // Capture the time field

        // Send data to the back-end
        fetch('/appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, date, time })
        })
        .then(response => response.text())
        .then(data => {
            alert('Appointment scheduled!');
            console.log(data); // Log the server's response

            // Reset the form fields after submission
            document.getElementById('appointment-form').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error scheduling appointment');
        });
    });
});
