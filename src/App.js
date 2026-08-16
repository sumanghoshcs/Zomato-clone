import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "./component/header/header";
import Tab from "./component/tabs/tab";
import Subfooter from "./component/Footer/subfooter";
import Footer from "./component/Footer/footer";
import { AuthModal } from "./components/AuthModal";
import { Toaster } from "./components/Toast";
import { subscribeToAuth } from "./firebase";
import { setSessionUser, clearSession } from "./redux/userSlice";
import { preloadMealPool } from "./data/mealDB";
import "./App.css";

const Delivery = lazy(() => import("./Delivery/delivery"));
const Diningout = lazy(() => import("./Dining out/diningout"));
const Nightlife = lazy(() => import("./NightLife/nightlife"));
const DefaultPage = lazy(() => import("./component/defaultpage/default"));
const RestaurantDetail = lazy(() => import("./pages/restaurantDetail"));
const CartPage = lazy(() => import("./pages/cart"));
const Checkout = lazy(() => import("./pages/checkout"));
const OrderSuccess = lazy(() => import("./pages/orderSuccess"));
const Orders = lazy(() => import("./pages/orders"));
const SearchPage = lazy(() => import("./pages/search"));
const Favorites = lazy(() => import("./pages/favorites"));

const SHOW_TAB_ROUTES = ["/", "/diningout", "/nightlife"];

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="spinner" />
    </div>
  );
}

function Layout() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const showTab = SHOW_TAB_ROUTES.includes(pathname);
  const hideFooter =
    pathname.startsWith("/checkout") || pathname.startsWith("/order-success");

  useEffect(() => {
    preloadMealPool();
  }, []);

  useEffect(() => {
    const unsub = subscribeToAuth((fbUser) => {
      if (fbUser && fbUser.email) {
        dispatch(setSessionUser({ email: fbUser.email }));
      } else {
        dispatch(clearSession());
      }
    });
    return unsub;
  }, [dispatch]);

  return (
    <>
      <Header />
      {showTab && <Tab />}
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Delivery />} />
            <Route path="/diningout" element={<Diningout />} />
            <Route path="/nightlife" element={<Nightlife />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/itemlist/:name/:img" element={<Navigate to="/" replace />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<DefaultPage />} />
          </Routes>
        </Suspense>
      </main>
      {!hideFooter && (
        <>
          <Subfooter />
          <Footer />
        </>
      )}
      <AuthModal />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <div className="App font-sans">
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;
