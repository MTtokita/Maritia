import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Ficha from './Ficha' // Importa seu novo arquivo
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ficha" element={<Ficha />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)