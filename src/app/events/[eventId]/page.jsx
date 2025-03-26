'use client';

import Navbar from '@/components/Navbar';
import { useFirebase } from '@/context/firebaseContext';
import {
	Alert,
	Box,
	CircularProgress,
	Container,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import React from 'react';
import SeatSelector from '@/components/SeatSelector';

const EventPage = () => {
	const { eventId } = useParams();
	const { db } = useFirebase();

	const fetchEventWithSeats = async (db, eventId) => {
		const eventDoc = await getDoc(doc(db, 'events', eventId));
		if (!eventDoc.exists()) {
			throw new Error('Event not found');
		}
		const eventData = { id: eventDoc.id, ...eventDoc.data() };

		const seatsSnapshot = await getDocs(
			collection(db, 'events', eventId, 'seats')
		);
		const seats = seatsSnapshot.docs.map((seatDoc) => ({
			id: seatDoc.id,
			...seatDoc.data(),
		}));

		return { ...eventData, seats };
	};

	//getting avalible seats of single event
	const {
		data: event,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['event', eventId],
		queryFn: () => fetchEventWithSeats(db, eventId),
		enabled: !!db && !!eventId,
	});

	if (isLoading) {
		return (
			<div>
				<Navbar />
				<Container
					sx={{
						display: 'flex',
						justifyContent: 'center',
						mt: 4,
						height: '100vh',
					}}
				>
					<CircularProgress />
				</Container>
			</div>
		);
	}

	if (error) {
		return (
			<div>
				<Navbar />
				<Container sx={{ mt: 4 }}>
					<Alert severity='error'>Error loading event: {error.message}</Alert>
				</Container>
			</div>
		);
	}

	return (
		<div>
			<Navbar />
			<Container sx={{ py: 4 }}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Typography
						variant='h3'
						component='h1'
						gutterBottom
					>
						{event.eventName}
					</Typography>
					<Box sx={{ mb: 4 }}>
						<Typography
							variant='h6'
							color='text.secondary'
						>
							{event.date} | {event.location}
						</Typography>
						<Typography
							variant='body1'
							sx={{ mt: 1 }}
						>
							{event.availableSeats} seats avalible
						</Typography>
					</Box>
					<Typography
						variant='h5'
						gutterBottom
					>
						Select Your Seats
					</Typography>
					<SeatSelector eventId={eventId} />
				</motion.div>
			</Container>
		</div>
	);
};

export default EventPage;
