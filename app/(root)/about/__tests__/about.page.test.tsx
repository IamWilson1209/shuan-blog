import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AboutPage, { metadata } from '../page';

jest.mock('sanity/lib/client', () => ({
  fetch: jest.fn(() => Promise.resolve({})),
}));

describe('About Page', () => {
  it('text renders correctly', async () => {
    render(<AboutPage />);
    expect(screen.getByText('What is Ex?')).toBeInTheDocument();
    expect(screen.getByText('Why Ex*?')).toBeInTheDocument();
  });
});

describe('About Page Metadata', () => {
  it('Should have the correct title', () => {
    expect(metadata.title).toBe('Ex* | About Ex*');
  });

  it('Should have the correct description', () => {
    expect(metadata.description).toContain(
      'Ex* is a public knowledge playground'
    );
  });

  it('Should have the correct openGraph title', () => {
    expect(metadata.openGraph?.title).toBe('Public PlayGround');
  });
});
