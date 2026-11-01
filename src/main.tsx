import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testFirestoreConnection } from './firebase';

// Verify connection to Firestore on initial boot
testFirestoreConnection();

createRoot(document.getElementById('root')!).render(<App />);
