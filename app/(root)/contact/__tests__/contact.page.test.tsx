import React from 'react';
import { render, screen } from '@testing-library/react';
import ContactPage, { metadata } from '../page';
import '@testing-library/jest-dom';
import { openGraphImage } from '@/app/shared-metadata';

describe('Contact Page', () => {
  it('renders contact information correctly', () => {
    render(<ContactPage />);
    expect(screen.getByText('Contact Me')).toBeInTheDocument();
  });
});

describe('Contact Page Metadata', () => {
  it('Should have the correct title', () => {
    expect(metadata.title).toBe('Ex* | Contact me');
  });

  it('Should have the correct description', () => {
    expect(metadata.description).toContain(
      'Contact Me Information: Email:zenfonlee@gmail.com, Phone:+886-965-650-099, GitHub: https://github.com/IamWilson1209, LinkedIn: https://linkedin.com/in/weishiuan'
    );
  });

  it('Should have the correct openGraph title', () => {
    expect(metadata.openGraph?.title).toBe('李瑋軒 | Wei-shiuan Lee');
  });

  it('should inherit properties from openGraphImage', () => {
    expect(metadata.openGraph).toMatchObject(openGraphImage);
  });
});
