import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  firebaseEnabled,
  signUpWithEmail,
  logInWithEmail,
} from "../firebase";

const USER_KEY = "zomato_user_v1";
const FAV_KEY = "zomato_favs_v1";
const REGISTERED_KEY = "zomato_registered_v1";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore */
  }
  return fallback;
}

function loadUser() {
  return loadJSON(USER_KEY, null);
}

function loadFavorites() {
  return loadJSON(FAV_KEY, []);
}

function loadRegistered() {
  return loadJSON(REGISTERED_KEY, []);
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* ignore */
  }
}

function toUser(registered, email) {
  const norm = email.toLowerCase();
  const found = (registered || []).find(
    (u) => u.email.toLowerCase() === norm
  );
  return {
    name: found?.name || norm.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    email: norm,
    phone: found?.phone || "",
  };
}

export const registerUserAsync = createAsyncThunk(
  "user/register",
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    try {
      if (firebaseEnabled) {
        await signUpWithEmail(email, password);
      }
      return { name, email, phone, password };
    } catch (e) {
      const code = e && e.code;
      if (code === "auth/email-already-in-use") {
        return rejectWithValue("An account with this email already exists. Try logging in.");
      }
      if (code === "auth/weak-password") {
        return rejectWithValue("Password should be at least 6 characters.");
      }
      return rejectWithValue("Sign up failed. Please try again.");
    }
  }
);

export const loginUserAsync = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      if (firebaseEnabled) {
        await logInWithEmail(email, password);
      }
      return { email };
    } catch (e) {
      const code = e && e.code;
      if (code === "auth/user-not-found") {
        return rejectWithValue("No account found with this email. Please sign up first.");
      }
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        return rejectWithValue("Incorrect password. Try again.");
      }
      return rejectWithValue("Login failed. Please try again.");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: loadUser(),
    favorites: loadFavorites(),
    registeredUsers: loadRegistered(),
    status: "idle",
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem(USER_KEY);
    },
    setSessionUser: (state, action) => {
      state.user = toUser(state.registeredUsers, action.payload.email);
      save(USER_KEY, state.user);
    },
    clearSession: (state) => {
      if (state.user) {
        state.user = null;
        localStorage.removeItem(USER_KEY);
      }
    },
    toggleFavorite: (state, action) => {
      const id = String(action.payload);
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((f) => f !== id);
      } else {
        state.favorites.push(id);
      }
      save(FAV_KEY, state.favorites);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const { password, ...profile } = action.payload;
        state.user = profile;
        const existing = state.registeredUsers.findIndex(
          (u) => u.email.toLowerCase() === profile.email.toLowerCase()
        );
        const record = { ...profile, password: password || "" };
        if (existing >= 0) {
          state.registeredUsers[existing] = record;
        } else {
          state.registeredUsers.push(record);
        }
        save(USER_KEY, profile);
        save(REGISTERED_KEY, state.registeredUsers);
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload || "Sign up failed.";
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = toUser(state.registeredUsers, action.payload.email);
        save(USER_KEY, state.user);
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload || "Login failed.";
      });
  },
});

export const { logoutUser, setSessionUser, clearSession, toggleFavorite } =
  userSlice.actions;

export const selectIsFavorite = (state, id) =>
  state.user.favorites.includes(String(id));

export default userSlice.reducer;
