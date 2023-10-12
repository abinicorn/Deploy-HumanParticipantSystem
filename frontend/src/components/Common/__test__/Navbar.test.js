import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navbar from '../Navbar';
import { BrowserRouter } from 'react-router-dom';
import { authService } from '../../../services/authService';

// Mock the useNavigate function
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));
  
// Mock the authService
jest.mock('../../../services/authService', () => ({
    authService: {
        signOut: jest.fn(),
    }
}));


beforeEach(() => {

    return { getByText, queryByText, getByRole, queryByRole, getByTestId } = render(
        <BrowserRouter>
            <Navbar/>
        </BrowserRouter>
        );
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Navbar Component', () => {

    it('renders Navbar component', () => {

        const appName = getByText('ResearchFusion');
        expect(appName).toBeInTheDocument();

    });

    it('opens user menu', async () => {

        const userMenuButton = getByRole('button', {name: 'Open settings'});
        fireEvent.click(userMenuButton);
        
        // Show user menu
        await waitFor(() => {
            expect(getByText('Profile')).toBeInTheDocument();
            expect(getByText('Logout')).toBeInTheDocument();
        });
    });

    it('handles setting click events correctly', async () => {

        const userMenuButton = getByRole('button', {name: 'Open settings'});
        fireEvent.click(userMenuButton);

        // Simulate a click on the 'Profile' setting
        const profileMenuItem = getByText('Profile');
        fireEvent.click(profileMenuItem);
        await waitFor(() => {
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/researcher/profile');
        });

        // Simulate a click on the 'Logout' setting
        const logoutMenuItem = getByText('Logout');
        fireEvent.click(logoutMenuItem);
        await waitFor(() => {
            expect(authService.signOut).toHaveBeenCalled();
            expect(mockedUsedNavigate).toHaveBeenLastCalledWith('/');
        });

    });

});