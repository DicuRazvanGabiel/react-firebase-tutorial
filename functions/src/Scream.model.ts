import { firestore } from "firebase-admin";

export interface Scream {
	body: string;
	userHandler: string;
	createAt: firestore.Timestamp;
}
