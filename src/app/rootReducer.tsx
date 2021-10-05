import { combineReducers } from "@reduxjs/toolkit";

// Reducers
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authReducers";
import usersReducer from "../features/users/usersSlice";
import settingsReducer from "../features/settings/settingsSlice";
import itemsReducer from "../features/setups/itemsSlice";
import businessPartnersReducer from "../features/setups/bpsSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  users: usersReducer,
  items: itemsReducer,
  businessPartners: businessPartnersReducer,
  transactions: transactionsReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
