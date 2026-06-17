import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

test('renders welcome message', () => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );

    const welcomeElement = screen.getByText(/welcome to home/i); // เปลี่ยนข้อความนี้ตามที่ปรากฏใน Home.js
    expect(welcomeElement).toBeInTheDocument();
});
