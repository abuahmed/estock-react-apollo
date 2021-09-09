import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";
import { ADD_UPDATE_ITEM, REMOVE_ITEM } from "../../apollo/mutations";
import {
  GET_ALL_ITEMS,
  GET_ALL_ITEM_CATEGORIES,
  GET_ALL_ITEM_UOMS,
  GET_SELECTED_ITEM,
} from "../../apollo/queries";

import { RootState } from "../../app/store";

import { AuthError } from "../auth/types/authType";
import { Category, Item, ItemsState } from "./types/itemType";

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
    const { rejectWithValue, getState, dispatch } = thunkAPI;
    //console.log(arg);
    try {
      let item = { ...arg };
      item.itemCategory = {
        id: item.itemCategoryId as number,
      };
      item.unitOfMeasure = {
        id: item.unitOfMeasureId as number,
      };
      const response = await apolloClient.mutate({
        mutation: ADD_UPDATE_ITEM,
        variables: {
          ...item,
        },
      });

      if (response && response.data && response.data.createItem) {
        const {
          items: { items },
        } = getState() as { items: ItemsState };
        let restItems = [...items];
        const addedItem = (await response.data.createItem) as Item;
        if (arg && arg.id) {
          restItems = restItems.filter((it) => it.id !== arg.id);
        }
        restItems.push(addedItem);
        dispatch(setItems(restItems));
        return addedItem;
      }
    } catch (error: any) {
      const { code, stack } = error;
      const message = error.message;
      dispatch(setSelectedItem(arg));
      //error.graphQLErrors[0].extensions.exception.response.status;
      return rejectWithValue({ code, message, id: uuidv4(), stack });
    }
  }
);

export const removeItem = createAsyncThunk<
  any,
  number,
  { rejectValue: AuthError }
>("items/removeItem", async (id, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
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
      let restItems = [...items];
      restItems = restItems.filter((item) => item.id !== id);
      dispatch(setItems(restItems));
      return restItems as Item[];
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

export const fetchItemCategories = createAsyncThunk<
  any,
  string,
  { rejectValue: AuthError }
>("items/fetchItemCategories", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_ITEM_CATEGORIES,
    });

    if (response && response.data && response.data.getItemCategories) {
      return response.data.getItemCategories as Category[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const fetchItemUoms = createAsyncThunk<
  any,
  string,
  { rejectValue: AuthError }
>("items/fetchItemUoms", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_ITEM_UOMS,
    });

    if (response && response.data && response.data.getItemUoms) {
      return response.data.getItemUoms as Category[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

const defaultValues: Item = {
  displayName: "",
  code: "",
  description: "",
  purchasePrice: 0,
  sellingPrice: 0,
  safeQty: 0,
};

const initialState: ItemsState = {
  items: [],
  categories: [],
  uoms: [],
  selectedItem: { ...defaultValues },
  loading: "idle",
  currentRequestId: undefined,
  success: false,
  error: null,
};

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    resetSelectedItem: (state) => {
      state.selectedItem = { ...defaultValues };
    },
    setSelectedItem: (state, { payload }) => {
      state.selectedItem = payload;
    },
    setItems: (state, { payload }) => {
      state.items = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItems.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(fetchItems.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.items = payload;
    });
    builder.addCase(fetchItems.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(fetchItemCategories.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(
      fetchItemCategories.fulfilled,
      (state, { payload, meta }) => {
        state.loading = "idle";
        state.categories = payload;
      }
    );
    builder.addCase(fetchItemCategories.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(fetchItemUoms.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(fetchItemUoms.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.uoms = payload;
    });
    builder.addCase(fetchItemUoms.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
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
      //console.log(payload);
      state.loading = "idle";
      state.error = payload;
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

    // builder.addCase(addItemCategory.pending, (state) => {
    //   state.loading = "pending";
    // });
    // builder.addCase(addItemCategory.fulfilled, (state, { payload }) => {
    //   state.loading = "idle";
    //   state.categories = payload;
    // });
    // builder.addCase(addItemCategory.rejected, (state, { payload }) => {
    //   state.loading = "idle";
    //   state.error = payload;
    // });

    // builder.addCase(addItemUom.pending, (state) => {
    //   state.loading = "pending";
    // });
    // builder.addCase(addItemUom.fulfilled, (state, { payload }) => {
    //   state.loading = "idle";
    //   state.uoms = payload;
    // });
    // builder.addCase(addItemUom.rejected, (state, { payload }) => {
    //   state.loading = "idle";
    //   state.error = payload;
    // });
  },
});

export const { resetSuccess, resetSelectedItem, setSelectedItem, setItems } =
  itemsSlice.actions;

// Selectors
export const selectItems = (state: RootState) => state.items as ItemsState;

export default itemsSlice.reducer;
