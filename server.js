const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const CSV_DIR = path.join(__dirname, 'csv');

app.use(express.static(__dirname));
app.use(bodyParser.json());

// GET CSV file
app.get('/csv/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(CSV_DIR, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// SAVE CSV file
app.post('/csv/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(CSV_DIR, filename);
    const csvData = req.body.csv;
    fs.writeFile(filePath, csvData, 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save CSV' });
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
