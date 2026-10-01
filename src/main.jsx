import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// ponytail: no StrictMode — it double-invokes effects in dev, which would
// double-start the timers and Web Audio loops. Re-add if you add effect guards.
createRoot(document.getElementById('root')).render(<App />)
