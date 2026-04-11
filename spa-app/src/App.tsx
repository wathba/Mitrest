import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menulist from "./features/menu/menu-list";
import MenuItemById from "./features/menu/menu-item-by-id";
import Navbar from "./layout/navBar";
import AmdminMenu from "./features/admins/amdmin-menu";
import MenuItemForm from "./features/admins/menu-item-form";
import { useDispatch, useSelector } from "react-redux";
import ShoppingCartComponent from "./features/cart/shopping-cart";
import CheckoutPage from "./features/cart/chekout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SuccessPage from "./features/cart/success-page";
import ProtectedRoute from "./features/user/protectedRoute";
import Login from "./features/user/login";
import { useEffect } from "react";
import { fetchCurrentUser } from "./slices/account-slice";
import AboutUs from "./features/aboutUs";

const publashableKey =
  process.env.STRIPE_PUBLISHABLE_KEY ||"pk_test_51THU6OAFn1KPWWxLkMxyi9jv4jTKOwAlCF1HrzPXXWloYh7JL7EQXVfq41xipgqd5aoPbcScRbtjc3fXRJPBTyhr00g8Z1xYwA";
const stripePromise = loadStripe(`${publashableKey}`);

function App() {
  const dispatch = useDispatch<any>();
  const { isAuthenticated } = useSelector((state: any) => state.account);

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchCurrentUser());
  }, [dispatch, isAuthenticated]);
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Menulist />} />
          <Route path="/menu" element={<Menulist />} />
          <Route path="/menu/:id" element={<MenuItemById />} />
          <Route path="/admin" element=
            {
          <ProtectedRoute roles="Admin">
            {<AmdminMenu />} 
          </ProtectedRoute>}   />
          <Route path="/admin/form" element={<MenuItemForm />} />
          <Route path="/cart" element={<ShoppingCartComponent />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/checkout"
            element={
              <Elements stripe={stripePromise}>
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
                
              </Elements>
            }
          />
          <Route path="/contact" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
