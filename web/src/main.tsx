import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import routes from './routes';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Toaster />
    <RouterProvider router={router} />
  </>
);
