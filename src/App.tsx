import { Routes, Route, Navigate } from 'react-router-dom';
import CreateFormPage from './pages/CreateFormPage';
import PreviewPage from './pages/PreviewPage';
import MyFormsPage from './pages/MyFormsPage';
import React from 'react';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create" replace />} />
      <Route path="/create" element={<CreateFormPage />} />
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="/myforms" element={<MyFormsPage />} />
    </Routes>
  );
}