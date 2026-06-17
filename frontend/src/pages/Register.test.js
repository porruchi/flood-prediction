import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';
import { MemoryRouter } from 'react-router-dom';

test('should update form fields on change', () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getAllByLabelText(/password/i)[0]; // ใช้ getAllByLabelText เพื่อดึงช่อง Password ออกมาแล้วเลือกตัวแรก

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(usernameInput, { target: { value: 'JohnDoe' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(emailInput.value).toBe('john@example.com');
    expect(usernameInput.value).toBe('JohnDoe');
    expect(passwordInput.value).toBe('123456');
});

test('should show alert if passwords do not match', () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );

    const passwordInput = screen.getAllByLabelText(/password/i)[0]; // ใช้ getAllByLabelText เพื่อดึงช่อง Password ออกมาแล้วเลือกตัวแรก
    const confirmPasswordInput = screen.getAllByLabelText(/password/i)[1]; // เลือกตัวที่สองสำหรับ Confirm Password

    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '123' } });

    // Mock alert
    window.alert = jest.fn();
    const submitButton = screen.getByText(/sign up/i);
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
});

test('renders Register component without crashing', () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
});
