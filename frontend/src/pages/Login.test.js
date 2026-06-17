import { render, screen, fireEvent, act } from '@testing-library/react';
import Login from './Login';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock axios and alert function
jest.mock('axios');
let mockOnLogin = jest.fn();

beforeEach(() => {
  window.alert = jest.fn(); // Reset alert before each test
  mockOnLogin = jest.fn();  // Reset onLogin mock function
  render(
    <MemoryRouter>
      <Login onLogin={mockOnLogin} />
    </MemoryRouter>
  );
});

describe('Login Component', () => {
  test('should update form fields on change', () => {
    const identifierInput = screen.getByLabelText(/email or username/i);
    fireEvent.change(identifierInput, { target: { value: 'testuser' } });
    expect(identifierInput.value).toBe('testuser');
  });

  test('should show alert on successful login', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const identifierInput = screen.getByLabelText(/email or username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/login/i);

    await act(async () => {
      fireEvent.change(identifierInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
    });

    expect(window.alert).toHaveBeenCalledWith('Login successful!');
    expect(mockOnLogin).toHaveBeenCalled(); // Verify the login function was called
  });

  test('should show alert on failed login', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Login failed' } },
    });

    const identifierInput = screen.getByLabelText(/email or username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/login/i);

    await act(async () => {
      fireEvent.change(identifierInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);
    });

    expect(window.alert).toHaveBeenCalledWith('Login failed. Please check your username/email and password.');
  });
});
