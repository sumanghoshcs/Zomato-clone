import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../components/modalBus";
import { selectCartCount } from "../foodcard/data/cartSlice";
import { logoutUser } from "../../redux/userSlice";
import { toast } from "../../components/Toast";

const LOGO =
  "https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png";

export function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const user = useSelector((state) => state.user.user);
  const [location, setLocation] = useState("Kolkata");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserMenu(false);
    setMobileMenu(false);
    toast("Logged out successfully");
  };

  const menuLink = "flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50";

  return (
    <header className="sticky top-0 z-[110] bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="mx-4 md:mx-10 lg:mx-20 2xl:mx-44 flex items-center justify-between gap-4 h-16">
        <Link to="/" className="shrink-0">
          <img src={LOGO} alt="Zomato" className="h-6 w-32 md:h-7 md:w-40" />
        </Link>

        <div className="hidden md:flex items-center border rounded-lg bg-white shadow-sm flex-1 max-w-2xl overflow-hidden">
          <div className="flex items-center gap-1 border-r border-gray-200 px-3 py-2.5 shrink-0">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-zomato" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option>Kolkata</option>
              <option>Mumbai</option>
              <option>Delhi NCR</option>
              <option>Bengaluru</option>
              <option>Pune</option>
              <option>Hyderabad</option>
              <option>Chennai</option>
              <option>Jaipur</option>
            </select>
          </div>
          <form onSubmit={handleSearch} className="flex items-center flex-1">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-400 ml-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for restaurants, cuisines or a dish"
              className="w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none"
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
            aria-label="Cart"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A2 2 0 008 18h8a2 2 0 002-2h-10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zomato px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 rounded-full bg-zomato/10 px-3 py-1.5 text-sm font-semibold text-zomato hover:bg-zomato/20 transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zomato text-white text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline max-w-28 truncate">{user.name.split(" ")[0]}</span>
                <svg viewBox="0 0 24 24" className="h-4 w-4 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {userMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white shadow-2xl overflow-hidden animate-pop-in">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button className={menuLink} onClick={() => { setUserMenu(false); navigate("/orders"); }}>
                    <span className="text-lg">🛍️</span> My Orders
                  </button>
                  <button className={menuLink} onClick={() => { setUserMenu(false); navigate("/favorites"); }}>
                    <span className="text-lg">💖</span> Favourites
                  </button>
                  <button className={menuLink} onClick={() => { setUserMenu(false); navigate("/cart"); }}>
                    <span className="text-lg">🛒</span> Cart
                  </button>
                  <button className={`${menuLink} text-red-600`} onClick={handleLogout}>
                    <span className="text-lg">🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4 text-lg text-gray-500">
              <button onClick={() => openAuthModal()} className="hover:text-gray-800 font-medium">
                Login
              </button>
              <button onClick={() => openAuthModal()} className="hover:text-gray-800 font-medium">
                Sign up
              </button>
            </div>
          )}

          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenu ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <form onSubmit={handleSearch} className="flex items-center border-b border-gray-100 px-4 py-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants or dishes"
              className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
          </form>
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-zomato" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
            >
              <option>Kolkata</option>
              <option>Mumbai</option>
              <option>Delhi NCR</option>
              <option>Bengaluru</option>
              <option>Pune</option>
              <option>Hyderabad</option>
              <option>Chennai</option>
              <option>Jaipur</option>
            </select>
          </div>
          {!user && (
            <div className="grid grid-cols-2 gap-3 px-4 py-4">
              <button
                onClick={() => { setMobileMenu(false); openAuthModal(); }}
                className="rounded-lg border-2 border-zomato py-2.5 text-sm font-semibold text-zomato"
              >
                Login
              </button>
              <button
                onClick={() => { setMobileMenu(false); openAuthModal(); }}
                className="rounded-lg bg-zomato py-2.5 text-sm font-semibold text-white"
              >
                Sign up
              </button>
            </div>
          )}
          <div className="px-4 pb-4 space-y-1">
            <Link to="/" onClick={() => setMobileMenu(false)} className="block rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50 font-medium">Home</Link>
            <Link to="/orders" onClick={() => setMobileMenu(false)} className="block rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50 font-medium">My Orders</Link>
            <Link to="/favorites" onClick={() => setMobileMenu(false)} className="block rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50 font-medium">Favourites</Link>
            <Link to="/cart" onClick={() => setMobileMenu(false)} className="block rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50 font-medium">Cart</Link>
            {user && (
              <button onClick={handleLogout} className="block w-full text-left rounded-lg px-3 py-2.5 text-red-600 hover:bg-red-50 font-medium">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
