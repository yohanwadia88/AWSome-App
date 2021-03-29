const AWSXRay = require('aws-xray-sdk');
const XRayExpress = AWSXRay.express;
const express = require('express');

// Capture all AWS clients we create
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
AWS.config.update({region: process.env.DEFAULT_AWS_REGION || 'eu-west-1'});

// const app = require('express')();
// const mysql = require('mysql');

const mysql = AWSXRay.captureMySQL(require('mysql'));

const app = express();
app.use(XRayExpress.openSegment('DemoApp'));

const bodyParser = require('body-parser');

app.use(bodyParser.json({
    limit: '8mb'
})); // support json encoded bodies

// environment variables
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// mysql credentials
const connection = mysql.createConnection({
	host: process.env.RDS_HOSTNAME || 'mysql-service',
	user: process.env.RDS_USERNAME || 'root',
	password: process.env.RDS_PASSWORD || 'password',
	database: process.env.RDS_DATABASE || 'colors',
        port: process.env.RDS_PORT
});

connection.connect((err) => {
	if (err) {
		console.error('error connecting mysql: ', err);
	} else {
		console.log('mysql connection successful');
		app.listen(PORT, HOST, (err) => {
			if (err) {
				console.error('Error starting  server', err);
			} else {
				console.log('server listening at port ' + PORT);
			}
		});
	}
});

// home page
app.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'Yaaay! Something is working!'
	});
});

// insert a record into database
app.post('/add', (req, res) => {
	const demo = req.body;
	const query = 'INSERT INTO mytable values(?, ?)';

	connection.query(query, [demo.name, demo.color], (err, results, fields) => {
		if (err) {
			console.error(err);
			res.json({
				success: false,
				message: 'Error occured'
			});
		} else {
			res.json({
				success: true,
				message: 'Successfully added the values!'
			});
		}
	});
});

// fetch all values 
app.post('/get', (req, res) => {
	const query = 'SELECT * FROM mytable';
    connection.query(query, (err, results, fields) => {
    	if (err) {
    		console.error(err);
    		res.json({
    			success: false,
    			message: 'Error occured'
    		});
    	} else {
    		res.json({
    			success: true,
    			result: results
    		});
    	}
    });
});

app.use(XRayExpress.closeSegment());
