const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const Agenda = require("agenda");
const agenda_helper = require("./helpers/agenda")
const application_routes = require("./routes/application_routes")
const asteroids_routes = require("./routes/asteroids_routes")
const config = require("./helpers/config")
const {fetch_data} = require("./helpers/nasa")
require("dotenv").config();

mongoose
	.connect(config.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log("connected to database!");
	})
	.catch(() => {
		console.log("Connection failed!");
		process.exit();
	});

mongoose.set("useFindAndModify", false);

const agenda = new Agenda({db: {address: config.MONGO_URL}})
agenda_helper.set_agenda_instance(agenda)

agenda.define("fetch_data", {concurrency: 1}, async (job) => {
	fetch_data()

})

agenda.start().then(ag => {
	agenda.every('12 hours', 'fetch_data')
}).catch(error=>{
	console.log(error)
})

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, DELETE, PUT, OPTIONS"
	);

	next();
});

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
	bodyParser.urlencoded({
		limit: "50mb",
		extended: true,
		parameterLimit: 50000,
	})
);

app.use("/", application_routes);
app.use("/asteroids", asteroids_routes)

module.exports = app;
