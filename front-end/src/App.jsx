import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './assets/pages/Login'
import Signup from './assets/pages/Signup'
import ProductPage from './assets/pages/ProductPage'
import OrdersPage from './assets/pages/OrdersPage'
import Admin from './assets/pages/Admin'
import OrdersAdmin from './assets/pages/OrdersAdmin'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/orders" element={<OrdersAdmin />} />
      </Routes>
    </Router>
  )
}

export default App