import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Scream } from "./Scream.model";

admin.initializeApp();
const db = admin.firestore();
// export const helloWorld = functions.https.onRequest((request, response) => {
// 	response.send("Hello Worls with Typescript");
// });

export const getScreams = functions.https.onRequest((req, res) => {
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

export const createScream = functions.https.onRequest((req, res) => {
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
