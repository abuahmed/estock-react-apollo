import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { AuthState, AuthUser } from "../features/auth/types/authType";
import { SettingsState } from "../features/settings/settingsSlice";
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
  settings: { isMiniMode: mini } as SettingsState,
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
