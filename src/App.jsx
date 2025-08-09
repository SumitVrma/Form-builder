import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container } from '@mui/material'
import Navigation from './components/Navigation'
import CreateForm from './pages/CreateForm'
import PreviewForm from './pages/PreviewForm'
import MyForms from './pages/MyForms'

function App() {

  return (
    <div className="App">
      <Navigation />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
