import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUserAsync, loginUserAsync } from "../redux/userSlice";
import { firebaseEnabled } from "../firebase";
import { onAuthModalOpen } from "./modalBus";
import { toast } from "./Toast";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zomato";

export function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const registeredUsers = useSelector((state) => state.user.registeredUsers || []);

  useEffect(() => {
    const unsub = onAuthModalOpen(() => setOpen(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors.form) setErrors({ ...errors, form: undefined });
  };

  const validate = () => {
    const errs = {};
    if (mode === "signup" && !form.name.trim()) errs.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (mode === "signup") {
      if (!/^\d{10}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit phone number";
      if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    } else if (!form.password) {
      errs.password = "Password is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    if (mode === "login") {
      if (!firebaseEnabled) {
        const registered = registeredUsers.find(
          (u) => u.email.toLowerCase() === form.email.toLowerCase()
        );
        if (!registered) {
          setErrors({ email: "No account found with this email. Please sign up first." });
          setSubmitting(false);
          return;
        }
        if (registered.password && registered.password !== form.password) {
          setErrors({ password: "Incorrect password. Try again." });
          setSubmitting(false);
          return;
        }
        dispatch(loginUserAsync({ email: form.email, password: form.password }));
        toast("Welcome back, " + registered.name.split(" ")[0] + "!");
        setOpen(false);
        setForm({ name: "", email: "", phone: "", password: "" });
        setSubmitting(false);
        return;
      }
      try {
        await dispatch(
          loginUserAsync({ email: form.email, password: form.password })
        ).unwrap();
        const registered = registeredUsers.find(
          (u) => u.email.toLowerCase() === form.email.toLowerCase()
        );
        const name =
          registered?.name ||
          form.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        toast("Welcome back, " + name.split(" ")[0] + "!");
        setOpen(false);
        setForm({ name: "", email: "", phone: "", password: "" });
      } catch (errMsg) {
        setErrors({ form: String(errMsg || "Login failed. Please try again.") });
      } finally {
        setSubmitting(false);
      }
    } else {
      try {
        await dispatch(
          registerUserAsync({
            name: form.name,
            email: form.email.toLowerCase(),
            phone: form.phone,
            password: form.password,
          })
        ).unwrap();
        toast("Account created. Welcome to Zomato!");
        setOpen(false);
        setForm({ name: "", email: "", phone: "", password: "" });
      } catch (errMsg) {
        setErrors({ form: String(errMsg || "Sign up failed. Please try again.") });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-pop-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-4 text-base font-semibold transition-colors ${
              mode === "login" ? "text-zomato border-b-2 border-zomato" : "text-gray-400"
            }`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-4 text-base font-semibold transition-colors ${
              mode === "signup" ? "text-zomato border-b-2 border-zomato" : "text-gray-400"
            }`}
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
          <button
            className="px-4 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {mode === "login" ? "Login to Zomato" : "Create your account"}
          </h2>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            {mode === "login"
              ? "Continue to order your favourite food."
              : "Sign up to start ordering with Zomato."}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} className={inputClass} />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} className={inputClass} />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            {mode === "signup" && (
              <div>
                <input name="phone" placeholder="Mobile number" value={form.phone} onChange={handleChange} className={inputClass} />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
            )}
            <div>
              <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className={inputClass} />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>
            {errors.form && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-600">
                {errors.form}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-zomato py-3 text-white font-semibold hover:bg-zomato-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="spinner-sm" />
                  {mode === "login" ? "Logging in..." : "Creating account..."}
                </>
              ) : mode === "login" ? (
                "Login"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-5">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
