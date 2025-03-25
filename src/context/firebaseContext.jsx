'use client';
import { initializeApp } from 'firebase/app';
import { createContext, useContext, useEffect, useState } from 'react';
import {
	createUserWithEmailAndPassword,
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	getFirestore,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';

const FirebaseContext = createContext(null);

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_APPKEY,
	authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
	projectId: process.env.NEXT_PUBLIC_PROJECTID,
	storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_MESSENGESSENDERID,
	appId: process.env.NEXT_PUBLIC_APPID,
};

export const useFirebase = () => useContext(FirebaseContext); // created custom hook

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//firebase functions
const firebaseAuth = getAuth(app);
const firebaseGoogleAuth = new GoogleAuthProvider(app);
const db = getFirestore(app);

//firebase Provider
export const FirebaseProvider = (props) => {
	//To check whether user is loged in or not
	const [user, setUser] = useState(null);

	useEffect(() => {
		onAuthStateChanged(firebaseAuth, (user) => {
			console.log('Auth state changed:', user);
			if (user) setUser(user);
			else setUser(null);
		});
	}, []);

	const signUpWithEP = (email, password) => {
		createUserWithEmailAndPassword(firebaseAuth, email, password);
	};

	const signInWithEP = (email, password) => {
		signInWithEmailAndPassword(firebaseAuth, email, password);
	};

	const signInWithGoogle = () => {
		signInWithPopup(firebaseAuth, firebaseGoogleAuth);
	};

	const createEvent = async (eventData) => {
		const eventRef = await addDoc(collection(db, 'events'), eventData);
		return eventRef.id;
	};

	const bookSeat = async (bookingData) => {
		const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
		const eventRef = doc(db, 'events', bookingData.eventId);
		await updateDoc(eventRef, {
			availableSeats: bookingData.availableSeats - 1,
		});
		return bookingRef.id;
	};

	//Logout
	const signOutUser = () => {
		signOut(firebaseAuth)
			.then(() => {
				console.log('Sign out successful');
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const isLoggedIn = user ? true : false;

	return (
		<FirebaseContext.Provider
			value={{
				signInWithEP,
				signUpWithEP,
				signInWithGoogle,
				isLoggedIn,
				signOutUser,
				createEvent,
				bookSeat,
				db,
			}}
		>
			{props.children}
		</FirebaseContext.Provider>
	);
};
