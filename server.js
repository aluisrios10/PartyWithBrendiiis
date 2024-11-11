const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/quote', (req, res) => {
    const { name, email, eventType, details } = req.body;
    console.log(`Quote request from ${name} (${email}) for a ${eventType}: ${details}`);
    res.send('Quote request received');
});

app.post('/appointment', (req, res) => {
    const { name, email, date } = req.body;
    console.log(`Appointment scheduled by ${name} (${email}) for ${date}`);
    res.send('Appointment scheduled');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
