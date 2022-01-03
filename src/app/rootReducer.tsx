import { combineReducers } from "@reduxjs/toolkit";

// Reducers
import authReducer from "../features/auth/authSlice";
import preferencesReducer from "../features/preferences/preferencesSlice";
import setupsReducer from "../features/setups/setupSlices";
import transactionsReducer from "../features/transactions/transactionsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  setups: setupsReducer,
  transactions: transactionsReducer,
  preferences: preferencesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
