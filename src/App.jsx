import { useState, useEffect } from 'react'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import {TitleProvider} from './context/TitleContext'
import OrderEntry from './pages/OrderEntry';
import OrderOverview from './pages/OrderOverview';
import Layout from './components/Layout';

function App() {
  return (
    <MantineProvider>
      <TitleProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path={'/'} element={<Navigate to="/orders/order-entry" replace />} />
              <Route path={'/orders/order-entry'} element={<OrderEntry />} />
              <Route path={'/orders/overview'} element={<OrderOverview/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TitleProvider>
    </MantineProvider>
  )
}

export default App
