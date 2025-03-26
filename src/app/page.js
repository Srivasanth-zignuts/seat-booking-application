'use client';
import Navbar from '@/components/Navbar';
import { useFirebase } from '@/context/firebaseContext';
import {
	Alert,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Container,
	Grid2,
	Pagination,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
	const firebase = useFirebase();
	const router = useRouter();
	const [page, setPage] = useState(1);
	const itemsPerPage = 9;

	//gets events with seats from firestore
	//here 1st we are getting all the events from firestore collection then getting avaliable seats for each event and then returning event details with avaliable Seats
	const fetchEventsWithSeats = async (db) => {
		const eventsSnapshot = await getDocs(collection(db, 'events'));
		const events = eventsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})); //id is self-generated in firestre therefore we are mapping in properly

		const eventsWithAvability = await Promise.all(
			events.map(async (event) => {
				const seatsSnapshot = await getDocs(
					collection(db, 'events', event.id, 'seats')
				);
				const avaliableSeats = seatsSnapshot.docs.filter(
					(doc) => !doc.data().booked
				).length;
				return { ...event, avaliableSeats };
			})
		);
		return eventsWithAvability;
	};

	//if the user is not logged In then, user will redirected to /auth/login
	useEffect(() => {
		if (!firebase.isLoggedIn) {
			router.push('/auth/login');
		}
	}, [firebase, router]);

	//react-query - fetch, cache, mange data
	const {
		data: events,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['events'], //cached under 'events'
		queryFn: () => fetchEventsWithSeats(firebase.db), //assumes a certain function
		enabled: !!firebase.isLoggedIn && !!firebase.db,
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
					<Alert severity='error'>Error loading events: {error.message}</Alert>
				</Container>
			</div>
		);
	}

	//for pagination

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const totalEvents = events?.length || 0;
	const totalPages = Math.ceil(totalEvents / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage;
	const paginatedEvents = events?.slice(startIndex, startIndex + itemsPerPage);

	return (
		<div>
			<Navbar />
			<Container
				sx={{
					py: 4,
				}}
			>
				<Typography
					variant='h3'
					component='h1'
					gutterBottom
					align='center'
				>
					Welcome !
				</Typography>
				<Typography
					variant='h6'
					color='text.secondary'
					align='center'
					sx={{ mb: 4 }}
				>
					Choose an event to book your seats
				</Typography>

				<Grid2
					container
					spacing={3}
					sx={{
						justifyContent: { xs: 'center', md: 'flex-start' },
					}}
				>
					{events?.map((event) => {
						const eventDate = new Date(event.date); //gets event Date
						const today = new Date(); //gets today date
						{
							/* today.setHours(0, 0, 0, 0); // Normalize to start of day for accurate comparison */
						}
						const isPastEvent = eventDate < today; //compare both
						return (
							<Grid2
								item
								xs={12}
								sm={6}
								md={4}
								key={event.id}
							>
								<motion.div
									initial={{ opacity: 0, scale: 0.5 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5, ease: 'easeInOut' }}
									whileHover={{ scale: 1.1 }}
								>
									<Card sx={{ height: '100%', width: '350px' }}>
										<CardContent>
											<Typography
												variant='h5'
												component='div'
											>
												{event.eventName}
											</Typography>
											<Typography
												variant='body2'
												color='text.secondary'
											>
												{event.date} - {event.location}
											</Typography>
											{/* <Typography
												variant='body1'
												sx={{ mt: 1 }}
											>
												{event.description}
											</Typography> */}
											<Typography
												variant='body2'
												color={event.availableSeats > 0 ? 'green' : 'red'}
												sx={{ mt: 1 }}
											>
												{isPastEvent
													? 'Event expired'
													: event.avaliableSeats > 0
													? `${event.avaliableSeats} seats available`
													: 'No seats available'}
											</Typography>
										</CardContent>
										<CardActions>
											{event.avaliableSeats > 0 && !isPastEvent ? (
												<>
													<Button
														variant='contained'
														href={`/events/${event.id}`}
														size='small'
													>
														{' '}
														Book Seats{' '}
													</Button>
													{/* <Button
														onClick={() => firebase.deleteEvent(event.id)}
														color='error'
													>
														{' '}
														Delete{' '}
													</Button> */}
												</>
											) : (
												<>
													<Button
														variant='contained'
														disabled
														size='small'
													>
														{isPastEvent ? 'Expired' : 'Full'}
													</Button>
													{/* <Button
														onClick={() => firebase.deleteEvent(event.id)}
														color='error'
													>
														{' '}
														Delete{' '}
													</Button> */}
												</>
											)}
										</CardActions>
									</Card>
								</motion.div>
							</Grid2>
						);
					})}
				</Grid2>

				{totalEvents > 9 && (
					<Box
						sx={{
							display: { xs: 'none', md: 'flex' },
							justifyContent: 'center',
							mt: 4,
						}}
					>
						<Pagination
							count={totalPages}
							page={page}
							onChange={handlePageChange}
							color='primary'
						/>
					</Box>
				)}
			</Container>
		</div>
	);
}
