'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useFirebase } from '@/context/firebaseContext';
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import CreateEventModal from '../app/create-event/page';

const pages = ['Create Event'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Navbar = () => {
	const { isLoggedIn, signOutUser } = useFirebase();
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const router = useRouter();

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = (setting) => {
		if (setting === 'Logout') {
			signOutUser();
			router.replace('/auth/login');
		}
		setAnchorElUser(null);
	};

	const handleCreateEvent = () => {
		router.push('/create-event');
	};

	return (
		<AppBar position='static'>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					{/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
					<Typography
						variant='h6'
						noWrap
						component='a'
						href='/'
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						SHOWTIME
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
							color='inherit'
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id='menu-appbar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{ display: { xs: 'block', md: 'none' } }}
						>
							<MenuItem onClick={handleCloseNavMenu}>
								<Button
									sx={{ textAlign: 'center' }}
									onClick={handleCreateEvent}
								>
									{' '}
									Create Event{' '}
								</Button>
							</MenuItem>
						</Menu>
					</Box>
					{/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
					<Typography
						variant='h5'
						noWrap
						component='a'
						href='/'
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						SHOWTIME
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page) => (
							<Button
								key={page}
								onClick={handleCloseNavMenu}
								sx={{ my: 2, color: 'white', display: 'block' }}
							>
								{page}
							</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						{isLoggedIn ? (
							<>
								<Tooltip title='Open settings'>
									<IconButton
										onClick={handleOpenUserMenu}
										sx={{ p: 0 }}
									>
										<Avatar sx={{ bgcolor: 'primary.main' }}>
											<Person />
										</Avatar>
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: '45px' }}
									id='menu-appbar'
									anchorEl={anchorElUser}
									anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
									keepMounted
									transformOrigin={{ vertical: 'top', horizontal: 'right' }}
									open={Boolean(anchorElUser)}
									onClose={() => handleCloseUserMenu(null)}
								>
									{settings.map((setting) => (
										<MenuItem
											key={setting}
											onClick={() => handleCloseUserMenu(setting)}
										>
											<Typography sx={{ textAlign: 'center' }}>
												{setting}
											</Typography>
										</MenuItem>
									))}
								</Menu>
							</>
						) : (
							<Button
								color='inherit'
								href='/auth/login'
							>
								Log In
							</Button>
						)}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default Navbar;
