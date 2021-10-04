import { createAsyncThunk, createSlice, ThunkDispatch } from "@reduxjs/toolkit";

import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";
import {
  ADD_UPDATE_ITEM,
  ADD_UPDATE_ITEM_CATEGORY,
  REMOVE_CATEGORY,
  REMOVE_ITEM,
} from "../../apollo/mutations";
import {
  GET_ALL_CATEGORIES,
  GET_ALL_ITEMS,
  GET_SELECTED_ITEM,
} from "../../apollo/queries";

import { RootState } from "../../app/store";
//import { sleep } from "../../utils/sleep";

import { RejectWithValueType } from "../auth/types/authType";
import {
  Category,
  CategoryType,
  Item,
  ItemsState,
  RemoveCategory,
} from "./types/itemTypes";

export const fetchItems = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("items/fetchItems", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    //await sleep(5000);
    const response = await apolloClient.query({
      query: GET_ALL_ITEMS,
    });

    if (response && response.data && response.data.items) {
      return response.data.items as Item[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const fetchCategories = createAsyncThunk<
  any,
  CategoryType,
  { rejectValue: RejectWithValueType }
>("items/fetchCategories", async (categoryType, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_CATEGORIES,
      variables: { type: categoryType },
    });

    if (response && response.data && response.data.getCategories) {
      return {
        type: categoryType,
        data: response.data.getCategories as Category[],
      };
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const getItem = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("items/getItem", async (_id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_ITEM,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getItem) {
      return response.data.getItem as Item;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const addItem = createAsyncThunk<
  any,
  Item,
  { rejectValue: RejectWithValueType }
>("items/addItem", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
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
      refetchQueries: [{ query: GET_ALL_ITEMS }],
    });

    if (response && response.data && response.data.createItem) {
      const addedItem = (await response.data.createItem) as Item;

      await setSuccessAction(dispatch, {
        message: "Item Successfully Saved",
      });

      return addedItem;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    dispatch(setSelectedItem(arg));
    await setErrorAction(dispatch, { message });
    //error.graphQLErrors[0].extensions.exception.response.status;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const addCategory = createAsyncThunk<
  any,
  Category,
  { rejectValue: RejectWithValueType }
>("items/addCategory", async (category, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: ADD_UPDATE_ITEM_CATEGORY,
      variables: {
        ...category,
      },
      refetchQueries: [
        {
          query: GET_ALL_CATEGORIES,
          variables: { type: category.type },
        },
      ],
    });

    if (response && response.data && response.data.createItemCategory) {
      const {
        items: { categories, uoms },
      } = getState() as { items: ItemsState };

      if (category.type === CategoryType.ItemCategory) {
        let restCategories = [...categories];
        const addedItem = (await response.data.createItemCategory) as Category;
        if (category && category.id) {
          restCategories = restCategories.filter((it) => it.id !== category.id);
        }
        restCategories.push(addedItem);

        return { type: category.type, data: restCategories };
      } else {
        let restUoms = [...uoms];
        const addedItem = (await response.data.createItemCategory) as Category;
        if (category && category.id) {
          restUoms = restUoms.filter((it) => it.id !== category.id);
        }
        restUoms.push(addedItem);
        return { type: category.type, data: restUoms };
      }
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const removeItem = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("items/removeItem", async (id, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_ITEM,
      variables: { id },
      refetchQueries: [{ query: GET_ALL_ITEMS }],
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
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const removeCategory = createAsyncThunk<
  any,
  RemoveCategory,
  { rejectValue: RejectWithValueType }
>("items/removeCategory", async (category, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_CATEGORY,
      variables: { id: category.id },
      refetchQueries: [
        {
          query: GET_ALL_CATEGORIES,
          variables: { type: category.type },
        },
      ],
    });

    if (response && response.data && response.data.removeCategory) {
      const {
        items: { categories, uoms },
      } = getState() as { items: ItemsState };

      if (category.type === CategoryType.ItemCategory) {
        let restCategories = [...categories];
        restCategories = restCategories.filter(
          (item) => item.id !== category.id
        );
        return restCategories as Category[];
      } else {
        let restUoms = [...uoms];
        restUoms = restUoms.filter((item) => item.id !== category.id);
        return restUoms as Category[];
      }
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

async function setSuccessAction(
  dispatch: ThunkDispatch<any, Item, any>,
  payload: any
) {
  dispatch(setSuccess(payload));
  setTimeout(() => {
    dispatch(resetSelectedItem());
    dispatch(resetSuccess());
  }, 2000);
}
async function setErrorAction(
  dispatch: ThunkDispatch<any, Item, any>,
  payload: any
) {
  dispatch(setError(payload));
  setTimeout(() => {
    dispatch(resetError());
  }, 6000);
}

const defaultValues: Item = {
  displayName: "",
  description: "",
  itemCategoryId: 0,
  unitOfMeasureId: 0,
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
  success: null,
  error: null,
};

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setSuccess: (state, { payload }) => {
      state.success = payload;
    },
    resetSuccess: (state) => {
      state.success = null;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
    resetError: (state) => {
      state.error = null;
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
    builder.addCase(fetchItems.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchItems.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.items = payload;
    });
    builder.addCase(fetchItems.rejected, (state, { payload, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchCategories.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      if (payload.type === CategoryType.ItemCategory)
        state.categories = payload.data;
      else if (payload.type === CategoryType.UnitOfMeasure)
        state.uoms = payload.data;
    });
    builder.addCase(fetchCategories.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(getItem.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getItem.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedItem = payload;
    });
    builder.addCase(getItem.rejected, (state, { payload, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(addItem.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addItem.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedItem = payload;
      //state.success = true;
    });
    builder.addCase(addItem.rejected, (state, { payload, error }) => {
      state.loading = "idle";
      //state.error = payload;
    });

    builder.addCase(removeItem.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeItem.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.items = payload;
      state.success = { message: "Item Removed Successfully" };
    });
    builder.addCase(removeItem.rejected, (state, { payload, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(addCategory.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addCategory.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      if (payload.type === CategoryType.ItemCategory)
        state.categories = payload.data;
      else state.uoms = payload.data;
      //state.success = true;
    });
    builder.addCase(addCategory.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(removeCategory.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeCategory.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      if (payload.type === CategoryType.ItemCategory)
        state.categories = payload.data;
      else state.uoms = payload.data;
    });
    builder.addCase(removeCategory.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });
  },
});

export const {
  resetSuccess,
  setSuccess,
  resetError,
  setError,
  resetSelectedItem,
  setSelectedItem,
  setItems,
} = itemsSlice.actions;

// Selectors
export const selectItems = (state: RootState) => state.items as ItemsState;

export default itemsSlice.reducer;
