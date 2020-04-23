import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Scream } from "./Scream.model";
admin.initializeApp();
const db = admin.firestore();
import * as express from "express";
const app = express();

import * as firebase from "firebase";
const firebaseConfig = {
	apiKey: "AIzaSyD81xOAspfSGr2XBeD3MAasgbo17ojeF8A",
	authDomain: "social-ape-78338.firebaseapp.com",
	databaseURL: "https://social-ape-78338.firebaseio.com",
	projectId: "social-ape-78338",
	storageBucket: "social-ape-78338.appspot.com",
	messagingSenderId: "31915126114",
	appId: "1:31915126114:web:f20bcbe36fea3f7849103b",
	measurementId: "G-DFT0B1E0J6",
};
firebase.initializeApp(firebaseConfig);

app.get("/screams", (req, res) => {
	admin
		.firestore()
		.collection("screams")
		.orderBy("createAt", "desc")
		.get()
		.then((snapshot) => {
			let screams: FirebaseFirestore.DocumentData = [];
			snapshot.forEach((doc) => {
				screams.push({
					screamId: doc.id,
					...doc.data(),
				});
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
		createAt: new Date().toISOString(),
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

//SingUp Route
app.post("/singup", (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		handle: req.body.handle,
	};

	//TODO validate data

	firebase
		.auth()
		.createUserWithEmailAndPassword(newUser.email, newUser.password)
		.then((data) => {
			return res.status(201).json({
				message: `user ${data.user!.uid} signed up successfully`,
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ message: err.code });
		});
});

exports.api = functions.region("europe-west3").https.onRequest(app);
