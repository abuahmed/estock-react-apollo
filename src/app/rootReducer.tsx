import { combineReducers } from "@reduxjs/toolkit";

// Reducers
import authReducer from "../features/auth/authReducers";
import usersReducer from "../features/users/usersSlice";
import settingsReducer from "../features/settings/settingsSlice";
import setupsReducer from "../features/setups/setupSlices";
import transactionsReducer from "../features/transactions/transactionsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  setups: setupsReducer,
  transactions: transactionsReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
