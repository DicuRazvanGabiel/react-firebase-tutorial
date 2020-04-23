import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Scream } from "./Scream.model";

const serviceAccount = require("../social-ape-78338-firebase-adminsdk-7kiq7-7fe7d0a9a8.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://social-ape-78338.firebaseio.com",
});

const db = admin.firestore();

import * as express from "express";

const app = express();

app.get("/screams", (req, res) => {
	admin
		.firestore()
		.collection("screams")
		.get()
		.then((snapshot) => {
			let screams: FirebaseFirestore.DocumentData = [];
			snapshot.forEach((doc) => {
				screams.push(doc.data());
			});
			return res.json(screams);
		})
		.catch((err) => {
			console.error(err);
		});
});

app.post("/screams", (req, res) => {
	const newScream: Scream = {
		body: req.body.body,
		userHandler: req.body.userHandler,
		createAt: admin.firestore.Timestamp.fromDate(new Date()),
	};

	db.collection("screams")
		.add(newScream)
		.then((doc) => {
			res.json({ message: `document ${doc.id} created successfully` });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: "something when wrong" });
		});
});

exports.api = functions.https.onRequest(app);
