import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import DistrictExplorer from "./pages/DistrictExplorer";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import SkillIntelligence from "./pages/SkillIntelligence";
import Impact from "./pages/Impact";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ArtisanDashboard from "./pages/artisan/ArtisanDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import LoginPage from "./pages/auth/LoginPage";
import UserSignupPage from "./pages/auth/UserSignupPage";
import ArtisanSignupPage from "./pages/auth/ArtisanSignupPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/cart/CartDrawer";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-[#0A192F]">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/district-explorer" element={<DistrictExplorer />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/skills" element={<SkillIntelligence />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<UserSignupPage />} />
                <Route path="/artisan-signup" element={<ArtisanSignupPage />} />

                {/* Protected Routes */}
                <Route path="/artisan-dashboard" element={
                  <ProtectedRoute allowedRoles={['artisan', 'admin']}>
                    <ArtisanDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/upload-product" element={
                  <ProtectedRoute allowedRoles={['artisan', 'admin']}>
                    <div className="p-8 mt-16 text-center text-white">Upload Product Page - Coming Soon</div>
                  </ProtectedRoute>
                } />
                <Route path="/user-dashboard" element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
