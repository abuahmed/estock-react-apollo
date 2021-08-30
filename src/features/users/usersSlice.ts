import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../app/store";
import { sleep } from "../../utils/sleep";

import {
  AuthenticatedUser,
  AuthState,
  AuthError,
} from "../auth/types/authType";

export type UsersState = {
  entities: AuthenticatedUser[];
  loading: "idle" | "pending";
  currentRequestId: string | undefined;
  error: any;
};

export const fetchUsers = createAsyncThunk<
  any,
  string,
  { rejectValue: AuthError }
>("users/fetchUsers", async (_arg, thunkAPI) => {
  const { rejectWithValue, getState, requestId } = thunkAPI;

  const {
    users: { currentRequestId, loading },
  } = getState() as { users: UsersState };

  if (loading !== "pending" || requestId !== currentRequestId) {
    return;
  }
  //await sleep(5000);
  const {
    auth: { user },
  } = getState() as { auth: AuthState };

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user!.token}`,
      },
    };

    const { data } = await axios.get("/api/users", config);
    //console.log(data)
    return data;
  } catch (error) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

const initialState: UsersState = {
  entities: [],
  loading: "idle",
  currentRequestId: undefined,
  error: null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state, { meta }) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = meta.requestId;
      }
    });
    builder.addCase(fetchUsers.fulfilled, (state, { payload, meta }) => {
      const { requestId } = meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.entities = payload;
        state.currentRequestId = undefined;
      }
    });
    builder.addCase(fetchUsers.rejected, (state, { payload, meta, error }) => {
      const { requestId } = meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.error = error;
        state.currentRequestId = undefined;
      }
    });
  },
});

// Selectors
export const selectUsers = (state: RootState) => state.users as UsersState;

export default usersSlice.reducer;
