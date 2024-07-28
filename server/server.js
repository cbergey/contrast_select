const express = require('express');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//test
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, '..'))); // Parent directory

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
//

app.post('/data', (req, res) => {
    const jsonData = req.body;

    const dataDir = path.join(__dirname, 'data');

    // create the 'data' directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
        console.log(`Created directory: ${dataDir}`);
    }
    const csvPath = path.join(dataDir, 'received_data.csv');

    // Check if the file exists and has data
    let fileExists = fs.existsSync(csvPath);
    let csvData;

    if (fileExists && fs.statSync(csvPath).size > 0) {
        // Convert JSON to CSV without headers
        const json2csvParser = new Parser({ header: false });
        csvData = json2csvParser.parse(jsonData) + '\n';
    } else {
        // Convert JSON to CSV with headers
        const json2csvParser = new Parser();
        csvData = json2csvParser.parse(jsonData) + '\n';
    }

    // Append the csv
    fs.appendFile(csvPath, csvData, (err) => {
        if (err) {
            return res.status(500).send('Error saving CSV data');
        }
        res.send('CSV data received and saved successfully');
    });
});

app.post('/data/social', (req, res) => {
    const jsonData = req.body;

    const dataDir = path.join(__dirname, 'data');

    // create the 'data' directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
        console.log(`Created directory: ${dataDir}`);
    }
    const csvPath = path.join(dataDir, 'social_exp_data.csv');

    // Check if the file exists and has data
    let fileExists = fs.existsSync(csvPath);
    let csvData;

    if (fileExists && fs.statSync(csvPath).size > 0) {
        // Convert JSON to CSV without headers
        const json2csvParser = new Parser({ header: false });
        csvData = json2csvParser.parse(jsonData) + '\n';
    } else {
        // Convert JSON to CSV with headers
        const json2csvParser = new Parser();
        csvData = json2csvParser.parse(jsonData) + '\n';
    }

    // Append the csv
    fs.appendFile(csvPath, csvData, (err) => {
        if (err) {
            return res.status(500).send('Error saving CSV data');
        }
        res.send('CSV data received and saved successfully');
    });
});

app.listen(3003, () => {
    console.log('Server is running on port 3003');
});