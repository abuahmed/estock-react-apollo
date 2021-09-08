import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";
import { ADD_UPDATE_ITEM, REMOVE_ITEM } from "../../apollo/mutations";
import {
  GET_ALL_ITEMS,
  GET_ALL_ITEM_CATEGORIES,
  GET_SELECTED_ITEM,
} from "../../apollo/queries";

import { RootState } from "../../app/store";

import { AuthError } from "../auth/types/authType";
import { Item, ItemsState } from "./types/itemType";

export const fetchItems = createAsyncThunk<
  any,
  string,
  { rejectValue: AuthError }
>("items/fetchItems", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_ITEMS,
    });

    if (response && response.data && response.data.items) {
      return response.data.items as Item[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const getItem = createAsyncThunk<
  any,
  number,
  { rejectValue: AuthError }
>("items/getItem", async (_id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_ITEM,
      variables: { id: _id },
    });

    // const categoriesResponse = await apolloClient.query({
    //   query: GET_ALL_ITEM_CATEGORIES,
    // });

    // const rlsRes = categoriesResponse.data.getItemCategories as Category[];

    if (response && response.data && response.data.getItem) {
      return response.data.getItem as Item;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const addItem = createAsyncThunk<any, Item, { rejectValue: AuthError }>(
  "items/addItem",
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    //const { id, displayName, purchasePrice } = arg;
    //console.log("arg", { ...arg });
    try {
      const response = await apolloClient.mutate({
        mutation: ADD_UPDATE_ITEM,
        variables: {
          ...arg,
        },
      });

      if (response && response.data && response.data.createItem) {
        return response.data.createItem as Item;
      }
    } catch (error: any) {
      const { code, stack } = error;
      const message =
        error.errors && error.errors[0].message
          ? error.errors[0].message
          : error.message;
      return rejectWithValue({ code, message, id: uuidv4(), stack });
    }
  }
);
export const createItem = () => {
  return {
    id: null,
    displayName: "",
  };
};
export const removeItem = createAsyncThunk<
  any,
  number,
  { rejectValue: AuthError }
>("items/removeItem", async (id, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;
  //const { id, displayName, purchasePrice } = arg;
  //console.log("arg", { ...arg });
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_ITEM,
      variables: { id },
    });

    if (response && response.data && response.data.removeItem) {
      const {
        items: { items },
      } = getState() as { items: ItemsState };
      const restItems = [...items];
      return restItems.filter((item) => item.id !== id) as Item[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message =
      error.errors && error.errors[0].message
        ? error.errors[0].message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

const initialState: ItemsState = {
  items: [],
  categories: [],
  uoms: [],
  selectedItem: {},
  loading: "idle",
  currentRequestId: undefined,
  success: null,
  error: null,
};
const defaultValues: Item = {
  displayName: "",
  code: "",
  description: "",
  purchasePrice: 0,
  sellingPrice: 0,
  safeQty: 0,
};
export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = undefined;
    },
    resetSelectedItem: (state) => {
      state.selectedItem = { ...defaultValues };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItems.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(fetchItems.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.items = payload;
      state.selectedItem = { ...defaultValues };
    });
    builder.addCase(fetchItems.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(getItem.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(getItem.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedItem = payload;
    });
    builder.addCase(getItem.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(addItem.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(addItem.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedItem = payload;
      state.success = true;
    });
    builder.addCase(addItem.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(removeItem.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(removeItem.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.items = payload;
      state.success = true;
    });
    builder.addCase(removeItem.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = error;
    });
  },
});

export const { resetSuccess, resetSelectedItem } = itemsSlice.actions;

// Selectors
export const selectItems = (state: RootState) => state.items as ItemsState;

export default itemsSlice.reducer;
