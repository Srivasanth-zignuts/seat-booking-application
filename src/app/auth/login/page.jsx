'use client';
import {
	Box,
	Button,
	Card,
	Container,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFirebase } from '@/context/firebaseContext';
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const firebase = useFirebase();
	const router = useRouter();
	// console.log(firebase);

	useEffect(() => {
		if (firebase.isLoggedIn) {
			router.push('/');
		}
	}, [firebase, router]);

	const handleLogIn = async (e) => {
		e.preventDefault();
		try {
			const res = await firebase.signInWithEP(email, password);
			console.log(res);
			setEmail('');
			setPassword('');
		} catch (err) {
			setError(err.message);
		}
	};

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
				Log In
			</Typography>
			<Card
				component='form'
				onSubmit={handleLogIn}
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
					margin='normal'
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
					<Typography> New User? </Typography>
					<Link
						href='/auth/signup'
						color='inherit'
						sx={{
							ml: 1,
						}}
					>
						{' '}
						Sign Up{' '}
					</Link>
				</Box>
				<Card
					sx={{
						mt: 2,
						p: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Typography variant='p'> Login using</Typography>
					<Box variant='div'>
						<Button onClick={firebase.signInWithGoogle}>
							<GoogleIcon color='error' />
						</Button>
					</Box>
				</Card>
			</Card>
		</Container>
	);
};

export default LoginPage;
