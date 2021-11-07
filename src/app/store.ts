import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { AuthState } from "../features/auth/types/authType";
import { PreferencesState } from "../features/preferences/preferencesSlice";
import rootReducer from "./rootReducer";

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo") as string)
  : null;
const miniMode = localStorage.getItem("miniMode")
  ? localStorage.getItem("miniMode")
  : false;
//console.log("Mini-", miniMode);
const mini = miniMode as boolean;
// const userInfoFromStorage = JSON.parse(
//   localStorage.getItem("userInfo") as string
// ) as AuthUser;
const preloadedState = {
  auth: { user: { ...userInfoFromStorage } } as AuthState,
  preferences: { isMiniMode: mini } as PreferencesState,
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
