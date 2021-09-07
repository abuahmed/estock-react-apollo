import { combineReducers } from "@reduxjs/toolkit";

// Reducers
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authReducers";
import usersReducer from "../features/users/usersSlice";
import settingsReducer from "../features/settings/settingsSlice";
import itemsReducer from "../features/items/itemsSlice";

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  users: usersReducer,
  items: itemsReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
