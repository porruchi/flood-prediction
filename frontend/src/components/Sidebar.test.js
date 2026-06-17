import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { BrowserRouter } from 'react-router-dom'; // เพิ่มการนำเข้า BrowserRouter

test('renders Sidebar with Logout button when logged in', () => {
  render(
    <BrowserRouter>
      <Sidebar isLoggedIn={true} onLogout={jest.fn()} />
    </BrowserRouter>
  );
  const logoutButton = screen.getByText(/logout/i);
  expect(logoutButton).toBeInTheDocument();
});

test('renders Sidebar with Login button when logged out', () => {
  render(
    <BrowserRouter>
      <Sidebar isLoggedIn={false} onLogout={jest.fn()} />
    </BrowserRouter>
  );
  const loginButton = screen.getByText(/login/i);
  expect(loginButton).toBeInTheDocument();
});
