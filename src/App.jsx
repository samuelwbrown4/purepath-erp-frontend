import { useState , useEffect } from 'react'
import '@mantine/core/styles.css';
import { MantineProvider} from '@mantine/core';
import {BrowserRouter , Routes , Route , Navigate} from 'react-router'
import OrderEntry from './pages/OrderEntry';

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Navigate to="/order-entry" replace />}/>
          <Route path={'/order-entry'} element={<OrderEntry/>}/>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
