import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import SignIn from './sign-in';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('Test cases for testing sign in', () => {
  test('User is able to submit username and password', async () => {
    const { container } = render(<SignIn />);
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const submitButton = container.querySelector('button[name="sign-in"]');

    fireEvent.change(emailInput, { target: { value: 'Hello' } });
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    fireEvent.click(submitButton);

    expect(emailInput.value).toBe('Hello');
    expect(passwordInput.value).toBe('pass');
  });
});
