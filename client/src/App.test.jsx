import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const renderResult = render(<App />);
  expect(renderResult.getByText(/Home/i)).toBeInTheDocument();
  expect(renderResult.getByText(/Other.*Page/i)).toBeInTheDocument();
});
