import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Search from './pages/Search';
import CompanyDetail from './pages/CompanyDetail';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/search', element: <Search /> },
      { path: '/company/:mst', element: <CompanyDetail /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
