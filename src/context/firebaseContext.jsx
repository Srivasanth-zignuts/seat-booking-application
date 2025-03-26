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
	updateDoc,
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

	// --
	const bookSeat = async ({ eventId, seatId, availableSeats }) => {
		const bookingRef = await addDoc(collection(db, 'bookings'), {
			eventId,
			seatId,
			timestamp: new Date(),
		});
		const eventRef = doc(db, 'events', eventId);
		await updateDoc(eventRef, {
			availableSeats: availableSeats - 1,
		});
		const seatRef = doc(db, 'events', eventId, 'seats', seatId);
		await updateDoc(seatRef, {
			booked: true,
		});
		return bookingRef.id;
	};

	// const deleteEvent = async (eventId) => {
	// 	try {
	// 		const eventRef = doc(db, 'events', eventId);
	// 		const seatPromises = await getDocs(
	// 			collection(db, 'events', eventId, 'seats')
	// 		);

	// 		const deleteSeatPromises = seatPromises.docs.map((seat) =>
	// 			deleteDoc(doc(db, 'events', eventId, 'seats', seat.id))
	// 		);
	// 		await Promise.all(deleteSeatPromises);

	// 		await deleteDoc(eventRef);
	// 		return true;
	// 	} catch (e) {
	// 		console.error('Error deleting event: ', e);
	// 		throw e;
	// 	}
	// };
	

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
				// deleteEvent,
			}}
		>
			{props.children}
		</FirebaseContext.Provider>
	);
};
