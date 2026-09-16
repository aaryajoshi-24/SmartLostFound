import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import NoticeBoard from './pages/NoticeBoard';
import ItemDetail from './pages/ItemDetail';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import EditItem from './pages/EditItem';
import MyReports from './pages/MyReports';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1, padding: '1rem 0 3rem' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<NoticeBoard />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/report-lost"
                element={
                  <ProtectedRoute>
                    <ReportLost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report-found"
                element={
                  <ProtectedRoute>
                    <ReportFound />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/items/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-reports"
                element={
                  <ProtectedRoute>
                    <MyReports />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Wooden Shelf Base Footer */}
          <footer
            style={{
              background: 'linear-gradient(180deg, #442812 0%, #2b1809 100%)',
              color: '#d6c7b2',
              textAlign: 'center',
              padding: '1.25rem',
              borderTop: '4px solid #573315',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              boxShadow: '0 -4px 10px rgba(0,0,0,0.3)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.15rem', color: '#fef3c7', marginBottom: '0.2rem' }}>
              📌 Smart Lost & Found System • Campus Community Corkboard
            </p>
            <p style={{ color: '#a89a8b', fontSize: '0.78rem' }}>
              Built with React, Express, Node.js & MongoDB • Designed for College Campuses
            </p>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
