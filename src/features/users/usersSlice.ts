import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";
import {
  ADD_USER_ROLES,
  ADD_USER_WAREHOUSES,
  CREATE_USER,
} from "../../apollo/mutations/users";
import {
  GET_ALL_ROLES,
  GET_ALL_USERS,
  GET_SELECTED_USER,
} from "../../apollo/queries";
import { RootState } from "../../app/store";

import {
  RejectWithValueType,
  AuthUser,
  Role,
  CreateUser,
} from "../auth/types/authType";

export const fetchUsers = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("users/fetchUsers", async (_arg, thunkAPI) => {
  const { rejectWithValue, getState, requestId } = thunkAPI;

  const {
    users: { currentRequestId, loading },
  } = getState() as { users: UsersState };

  if (loading !== "pending" || requestId !== currentRequestId) {
    return;
  }

  try {
    const response = await apolloClient.query({
      query: GET_ALL_USERS,
    });

    if (response && response.data && response.data.Users) {
      return response.data.Users as AuthUser[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const getUser = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("users/getUser", async (userId, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_USER,
      variables: { id: userId },
    });
    if (response && response.data && response.data.GetUser) {
      return response.data.GetUser as AuthUser;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const createUser = createAsyncThunk<
  any,
  CreateUser,
  { rejectValue: RejectWithValueType }
>("users/createUser", async (user, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_USER,
      variables: { ...user },
    });

    if (response && response.data && response.data.createUser) {
      return response.data.createUser as AuthUser;
    }
    //return [];
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const addUserRoles = createAsyncThunk<
  any,
  number[],
  { rejectValue: RejectWithValueType }
>("users/addUserRoles", async (arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.mutate({
      mutation: ADD_USER_ROLES,
      variables: { ids: arg },
      refetchQueries: [{ query: GET_SELECTED_USER, variables: { id: arg[0] } }],
    });

    if (response && response.data && response.data.addUserRoles) {
      return response.data.addUserRoles as AuthUser;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const addUserWarehouses = createAsyncThunk<
  any,
  number[],
  { rejectValue: RejectWithValueType }
>("users/addUserWarehouses", async (arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: ADD_USER_WAREHOUSES,
      variables: { ids: arg },
      refetchQueries: [{ query: GET_SELECTED_USER, variables: { id: arg[0] } }],
    });

    if (response && response.data && response.data.addUserWarehouses) {
      return response.data.addUserWarehouses as AuthUser;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const fetchRoles = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("users/fetchRoles", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_ROLES,
    });

    if (response && response.data && response.data.GetRoles) {
      return response.data.GetRoles as Role[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export type UsersState = {
  entities: AuthUser[];
  roles: Role[];
  selectedUser: AuthUser | null;
  loading: "idle" | "pending";
  currentRequestId: string | undefined;
  error: any;
};

const initialState: UsersState = {
  entities: [],
  roles: [],
  selectedUser: { name: "", email: "" },
  loading: "idle",
  currentRequestId: undefined,
  error: null,
};
export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSelectedUser: (state, { payload }) => {
      state.selectedUser = payload;
    },
    setUsers: (state, { payload }) => {
      state.entities = payload;
    },
    resetSelectedUser: (state, { payload }) => {
      state.selectedUser = payload;
    },
  },
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

    builder.addCase(getUser.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(getUser.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedUser = payload;
    });
    builder.addCase(getUser.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(createUser.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(createUser.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedUser = payload;
    });
    builder.addCase(createUser.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(fetchRoles.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(fetchRoles.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.roles = payload;
    });
    builder.addCase(fetchRoles.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(addUserRoles.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(addUserRoles.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedUser = payload;
    });
    builder.addCase(
      addUserRoles.rejected,
      (state, { payload, meta, error }) => {
        state.loading = "idle";
        state.error = error;
      }
    );
    builder.addCase(addUserWarehouses.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(addUserWarehouses.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedUser = payload;
    });
    builder.addCase(
      addUserWarehouses.rejected,
      (state, { payload, meta, error }) => {
        state.loading = "idle";
        state.error = error;
      }
    );
  },
});

export const { resetSelectedUser, setSelectedUser, setUsers } =
  usersSlice.actions;
// Selectors
export const selectUsers = (state: RootState) => state.users as UsersState;

export default usersSlice.reducer;
