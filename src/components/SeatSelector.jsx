'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFirebase } from '@/context/firebaseContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Box, Button, Grid2, Typography } from '@mui/material';

const SeatSelector = ({ eventId }) => {
	const [selectedSeats, setSelectedSeats] = useState([]);
	const { db, bookSeat, user } = useFirebase();
	const queryClient = useQueryClient();

	const fetchSeats = async (db, eventId) => {
		const seatsSnapshot = await getDocs(
			collection(db, 'events', eventId, 'seats')
		);
		return seatsSnapshot.docs.map((seat) => ({ id: seat.id, ...seat.data() }));
	};

	const { data: seats, refetch } = useQuery({
		queryKey: ['seats', eventId],
		queryFn: () => fetchSeats(db, eventId),
		enabled: !!db && !!eventId,
	});

	const { data: event } = useQuery({
		queryKey: ['event', eventId],
		queryFn: async () => {
			const eventDoc = await getDoc(doc(db, 'events', eventId));
			return eventDoc.exists() ? { id: eventDoc.id, ...eventDoc.data() } : null;
		},
		enabled: !!db && !!eventId,
	});

	//--
	//Used for updating data
	const mutation = useMutation({
		mutationFn: async () => {
			const bookingPromises = selectedSeats.map((seatId) =>
				bookSeat({
					eventId,
					seatId,
					availableSeats: event.availableSeats - selectedSeats.indexOf(seatId),
				})
			);
			await Promise.all(bookingPromises);
		},
		onSuccess: () => {
			setSelectedSeats([]);
			queryClient.invalidateQueries(['seats', eventId]);
			queryClient.invalidateQueries(['events']);
		},
		onError: (error) => {
			console.error('Error booking seats:', error);
			alert('Failed to book seats: ' + error.message);
		},
	});

	const handleBooking = () => {
		if (selectedSeats.length > 0) {
			mutation.mutate(); //calls the mutation function
		}
	};

	const handleSeatClick = (seat) => {
		if (seat.booked) return;
		setSelectedSeats((prev) =>
			prev.includes(seat.id)
				? prev.filter((id) => id !== seat.id)
				: [...prev, seat.id]
		);
	};

	if (!seats || seats.length === 0) {
		return <Typography>No seats available for this event.</Typography>;
	}

	return (
		<div>
			<Grid2
				container
				spacing={1}
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(10, 50px)',
					justifyContent: 'center',
					my: 2,
				}}
			>
				<AnimatePresence>
					{seats.map((seat) => (
						<Grid2
							item
							key={seat.id}
						>
							{' '}
							{/* Added Grid2 item with unique key */}
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								whileHover={{ scale: 1.1 }}
								onClick={() => handleSeatClick(seat)}
							>
								<Box
									sx={{
										width: 40,
										height: 40,
										backgroundColor: seat.booked
											? 'grey'
											: selectedSeats.includes(seat.id)
											? 'green'
											: 'lightblue',
										borderRadius: 1,
										cursor: seat.booked ? 'not-allowed' : 'pointer',
									}}
									title={
										seat.booked && seat.email
											? `Booked by: ${seat.email}`
											: 'Available'
									}
								/>
							</motion.div>
						</Grid2>
					))}
				</AnimatePresence>
			</Grid2>
			<Box>
				<Typography
					variant='body2'
					sx={{ mt: 2 }}
				>
					Selected Seats : {selectedSeats.length}
				</Typography>
				<Button
					variant='contained'
					onClick={handleBooking}
					disabled={selectedSeats.length === 0 || mutation.isLoading}
					sx={{ mt: 2 }}
				>
					Book {selectedSeats.length} Seat
					{selectedSeats.length !== 1 ? 's' : ''}
				</Button>
			</Box>
		</div>
	);
};

export default SeatSelector;

//useQuery -> used to fetch
//useMutation -> used to make changes in data
