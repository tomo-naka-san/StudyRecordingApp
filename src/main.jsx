import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import './index.css'
import App from './App.jsx'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({config});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
