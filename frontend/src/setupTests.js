// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// src/setupTests.js

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // สำหรับการทำงานแบบเก่าที่ใช้ addListener
      removeListener: jest.fn(), // สำหรับการทำงานแบบเก่าที่ใช้ removeListener
      addEventListener: jest.fn(), // สำหรับการทำงานแบบใหม่ที่ใช้ addEventListener
      removeEventListener: jest.fn(), // สำหรับการทำงานแบบใหม่ที่ใช้ removeEventListener
      dispatchEvent: jest.fn(),
    })),
  });
  