'use client';
import { useFirebase } from '@/context/firebaseContext';
import { Button, Card, Link, TextField, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const firebase = useFirebase();
	const router = useRouter();

	const handleSignUp = async (e) => {
		e.preventDefault();
		try {
			const res = await firebase.signUpWithEP(email, password);
			console.log(res);
			setEmail('');
			setPassword('');
		} catch (err) {
			setError(err.message);
		}
	};

	useEffect(() => {
		if (firebase.isLoggedIn) {
			router.push('/');
		}
	}, [firebase, router]);

	return (
		<Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}
			maxWidth='xs'
		>
			<Typography
				variant='h4'
				gutterBottom
				fontWeight='bold'
			>
				Sign Up
			</Typography>
			<Card
				component='form'
				onSubmit={handleSignUp}
				sx={{
					maxWidth: 400,
					mx: 'auto',
					p: 4,
				}}
			>
				<TextField
					label='Email'
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					fullWidth
					required
					variant='outlined'
				/>
				<TextField
					label='Password'
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					fullWidth
					margin='normal'
					required
					variant='outlined'
				/>
				{error && <Typography color='error'> {error} </Typography>}
				<Button
					type='submit'
					variant='contained'
					fullWidth
					sx={{ mt: 2 }}
				>
					Sign Up
				</Button>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						m: 1,
					}}
				>
					<Typography> Already a User? </Typography>
					<Link
						href='/auth/login'
						color='inherit'
						sx={{
							ml: 1,
						}}
					>
						{' '}
						Log In{' '}
					</Link>
				</Box>
			</Card>
		</Container>
	);
};

export default page;
