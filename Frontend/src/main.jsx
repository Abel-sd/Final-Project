import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()
const store = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
})
createRoot(document.getElementById('root')).render(
 
  <QueryClientProvider client={queryClient}>
<AuthProvider store={store}>
<ReactQueryDevtools initialIsOpen={false} />
 <BrowserRouter>
  
    <App />
    </BrowserRouter>
  
    
  </AuthProvider>
  </QueryClientProvider>
  
     ,
)
