import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ContractPage from './features/contract/ContractPage'
import CurrencyPage from './features/CurrencyPage'
import ExpensesPage from './features/expenses/ExpensesPage'
import BottomNav from './components/layout/BottomNav'
import ChecklistPage from './features/CheckList/CheckList'
import { Navigate } from 'react-router-dom'
import  Header  from './components/layout/Header'
import FaqPage from './features/faq/FaqPage'

const saved = localStorage.getItem('sea-theme');
if (saved) {
    const { state } = JSON.parse(saved);
    if (state?.theme && state.theme !== 'system') {
        document.documentElement.setAttribute('data-theme', state.theme);
    }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <BottomNav />
        <Header/>
        <Routes>
            <Route path="/" element={<Navigate to="/contract" replace />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contract" element={<ContractPage />} />
            <Route path="/currency" element={<CurrencyPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/checklist" element={<ChecklistPage />} /> 
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
