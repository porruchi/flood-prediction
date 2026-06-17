import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';
import { MemoryRouter } from 'react-router-dom';

// Mock matchMedia เพื่อแก้ปัญหา matchMedia not present
beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  

test('renders search input', () => {
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText(/search .../i);
    expect(searchInput).toBeInTheDocument();
});

test('should filter blog items based on search input', () => {
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search .../i);
    fireEvent.change(searchInput, { target: { value: 'Pet Care' } });

    const filteredBlog = screen.getByText(/Pet Care Products/i);
    expect(filteredBlog).toBeInTheDocument();
});
