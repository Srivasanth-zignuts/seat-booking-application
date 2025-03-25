'use client';

import Navbar from '@/components/Navbar';
import { useFirebase } from '@/context/firebaseContext';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateEventModal = () => {
	const { createEvent, db } = useFirebase();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [form, setForm] = useState({
		eventName: '',
		date: '',
		location: '',
		description: '',
		totalSeats: '',
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const totalSeats = parseInt(form.totalSeats, 10);
		if (isNaN(totalSeats) || totalSeats <= 0) {
			alert('Please enter valid number of seats');
			return;
		}

		try {
			const eventData = {
				eventName: form.eventName,
				date: form.date,
				location: form.location,
				description: form.description,
				availableSeats: totalSeats,
			};
			const eventId = await createEvent(eventData);

			const seatPromises = Array.from({ length: totalSeats }, (_, i) =>
				setDoc(doc(db, 'events', eventId, 'seats', `${eventId}_seat${i + 1}`), {
					eventId,
					booked: false,
				})
			);
			await Promise.all(seatPromises);

			queryClient.invalidateQueries(['events']);

			router.push('/');
		} catch (error) {
			console.error('Error creating event:', error);
			alert('Failed to create event');
		}
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	return (
		<div>
			<Navbar />
			<Container sx={{ py: 4 }}>
				<Typography
					variant='h4'
					gutterBottom
				>
					Create New Event
				</Typography>
				<Box
					component='form'
					onSubmit={handleSubmit}
					sx={{ maxWidth: 500 }}
				>
					<TextField
						label='Event Name'
						name='eventName'
						value={form.eventName}
						onChange={handleChange}
						fullWidth
						required
						sx={{ mb: 2 }}
					/>
					<TextField
						label='Date'
						name='date'
						type='date'
						value={form.date}
						onChange={handleChange}
						fullWidth
						required
						InputLabelProps={{ shrink: true }}
						sx={{ mb: 2 }}
					/>
					<TextField
						label='Location'
						name='location'
						value={form.location}
						onChange={handleChange}
						fullWidth
						required
						sx={{ mb: 2 }}
					/>
					<TextField
						label='Description'
						name='description'
						value={form.description}
						onChange={handleChange}
						fullWidth
						multiline
						rows={3}
						sx={{ mb: 2 }}
					/>
					<TextField
						label='Number of Seats'
						name='totalSeats'
						type='number'
						value={form.totalSeats}
						onChange={handleChange}
						fullWidth
						required
						min='1'
						sx={{ mb: 2 }}
					/>
					<Button
						type='submit'
						variant='contained'
						fullWidth
					>
						Create Event
					</Button>
				</Box>
			</Container>
		</div>
	);
};

export default CreateEventModal;
