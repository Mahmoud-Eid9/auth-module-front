import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>,
)
