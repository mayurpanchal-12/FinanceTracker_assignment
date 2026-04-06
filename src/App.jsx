import { TransactionProvider } from './context/TransactionContext';
import { BudgetProvider } from './context/BudgetContext';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundry';
import PageLoader from './components/PageLoader';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import './App.css';
import Wildcard from './pages/wildcard';

const HomePage = lazy(() => import('./pages/HomePage'));
const ChartPage = lazy(() => import('./pages/ChartPage'));
const SetTransactionPage = lazy(() => import('./pages/SetTransactionPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const BudgetPage = lazy(() => import('./pages/BudgetPage'));

const withEB = (element) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      {element}
    </Suspense>
  </ErrorBoundary>
);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: withEB(<HomePage />),
        },
        {
          path: 'set-transaction',
          element: withEB(<SetTransactionPage />),
        },
        {
          path: 'charts',
          element: withEB(<ChartPage />),
        },
        {
          path: 'insights',
          element: withEB(<InsightsPage />),
        },
        {
          path: 'budget',
          element: withEB(<BudgetPage />),
        },
        {
          path: 'notes',
          element: withEB(<NotesPage />),
        },
        
      ],
    },
    {
      path: '*',
      element: <Wildcard />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default function App() {
  return (
    <BudgetProvider>
      <TransactionProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </TransactionProvider>
    </BudgetProvider>
  );
}
