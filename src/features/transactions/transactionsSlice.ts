import { createAsyncThunk, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
//import { store } from "../../app/store";

import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";
import { GET_ALL_TRANSACTIONS } from "../../apollo/queries/transactions";

import { RootState } from "../../app/store";

import { AuthError } from "../auth/types/authType";
import {
  TransactionHeader,
  TransactionLine,
  TransactionsState,
} from "./types/transactionTypes";

export const fetchHeaders = createAsyncThunk<
  any,
  string,
  { rejectValue: AuthError }
>("transactions/fetchHeaders", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  console.log(_arg);
  try {
    const response = await apolloClient.query({
      query: GET_ALL_TRANSACTIONS,
      variables: { type: _arg },
    });

    if (response && response.data && response.data.transactions) {
      return response.data.transactions as TransactionHeader[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

// export const getItem = createAsyncThunk<
//   any,
//   number,
//   { rejectValue: AuthError }
// >("items/getItem", async (_id, thunkAPI) => {
//   const { rejectWithValue } = thunkAPI;
//   try {
//     const response = await apolloClient.query({
//       query: GET_SELECTED_ITEM,
//       variables: { id: _id },
//     });

//     if (response && response.data && response.data.getItem) {
//       return response.data.getItem as Item;
//     }
//   } catch (error: any) {
//     const { code, stack } = error;
//     const message =
//       error.response && error.response.data.message
//         ? error.response.data.message
//         : error.message;
//     return rejectWithValue({ code, message, id: uuidv4(), stack });
//   }
// });
// export const addItem = createAsyncThunk<any, Item, { rejectValue: AuthError }>(
//   "items/addItem",
//   async (arg, thunkAPI) => {
//     const { rejectWithValue, getState, dispatch } = thunkAPI;
//     try {
//       let item = { ...arg };
//       item.itemCategory = {
//         id: item.itemCategoryId as number,
//       };
//       item.unitOfMeasure = {
//         id: item.unitOfMeasureId as number,
//       };
//       const response = await apolloClient.mutate({
//         mutation: ADD_UPDATE_ITEM,
//         variables: {
//           ...item,
//         },
//       });

//       if (response && response.data && response.data.createItem) {
//         const {
//           items: { items },
//         } = getState() as { items: ItemsState };
//         let restItems = [...items];
//         const addedItem = (await response.data.createItem) as Item;
//         if (arg && arg.id) {
//           restItems = restItems.filter((it) => it.id !== arg.id);
//         }
//         restItems.push(addedItem);
//         dispatch(setItems(restItems));
//         await setSuccessAction(dispatch, {
//           message: "Item Successfully Saved",
//         });

//         return addedItem;
//       }
//     } catch (error: any) {
//       const { code, stack } = error;
//       const message = error.message;
//       dispatch(setSelectedItem(arg));
//       await setErrorAction(dispatch, { message });
//       //error.graphQLErrors[0].extensions.exception.response.status;
//       return rejectWithValue({ code, message, id: uuidv4(), stack });
//     }
//   }
// );

// export const removeItem = createAsyncThunk<
//   any,
//   number,
//   { rejectValue: AuthError }
// >("items/removeItem", async (id, thunkAPI) => {
//   const { rejectWithValue, getState, dispatch } = thunkAPI;
//   try {
//     const response = await apolloClient.mutate({
//       mutation: REMOVE_ITEM,
//       variables: { id },
//     });

//     if (response && response.data && response.data.removeItem) {
//       const {
//         items: { items },
//       } = getState() as { items: ItemsState };
//       let restItems = [...items];
//       restItems = restItems.filter((item) => item.id !== id);
//       dispatch(setItems(restItems));
//       return restItems as Item[];
//     }
//   } catch (error: any) {
//     const { code, stack } = error;
//     const message =
//       error.errors && error.errors[0].message
//         ? error.errors[0].message
//         : error.message;
//     return rejectWithValue({ code, message, id: uuidv4(), stack });
//   }
// });

async function setSuccessAction(
  dispatch: ThunkDispatch<any, any, any>,
  payload: any
) {
  dispatch(setSuccess(payload));
  setTimeout(() => {
    dispatch(resetSelectedLine());
    dispatch(resetSuccess());
  }, 2000);
}
async function setErrorAction(
  dispatch: ThunkDispatch<any, any, any>,
  payload: any
) {
  dispatch(setError(payload));
  setTimeout(() => {
    dispatch(resetError());
  }, 6000);
}

const defaultValues: TransactionLine = {
  qty: 0,
  eachPrice: 0,
};

const initialState: TransactionsState = {
  headers: [],
  lines: [],
  //selectedHeader: {},
  selectedLine: {},
  loading: "idle",
  currentRequestId: undefined,
  success: null,
  error: null,
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = null;
    },
    setSuccess: (state, { payload }) => {
      state.success = payload;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetSelectedLine: (state) => {
      state.selectedLine = { ...defaultValues };
    },
    setSelectedLine: (state, { payload }) => {
      state.selectedLine = payload;
    },
    setHeaders: (state, { payload }) => {
      state.headers = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHeaders.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(fetchHeaders.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.headers = payload;
    });
    builder.addCase(fetchHeaders.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    // builder.addCase(getItem.pending, (state, { meta }) => {
    //   state.loading = "pending";
    // });
    // builder.addCase(getItem.fulfilled, (state, { payload, meta }) => {
    //   state.loading = "idle";
    //   state.selectedItem = payload;
    // });
    // builder.addCase(getItem.rejected, (state, { payload, meta, error }) => {
    //   state.loading = "idle";
    //   state.error = error;
    // });

    // builder.addCase(addItem.pending, (state, { meta }) => {
    //   state.loading = "pending";
    // });
    // builder.addCase(addItem.fulfilled, (state, { payload, meta }) => {
    //   state.loading = "idle";
    //   state.selectedItem = payload;
    //   //state.success = true;
    // });
    // builder.addCase(addItem.rejected, (state, { payload, meta, error }) => {
    //   //console.log(payload);
    //   state.loading = "idle";
    //   //state.error = payload;
    // });

    // builder.addCase(removeItem.pending, (state, { meta }) => {
    //   state.loading = "pending";
    // });
    // builder.addCase(removeItem.fulfilled, (state, { payload, meta }) => {
    //   state.loading = "idle";
    //   state.items = payload;
    //   state.success = { message: "Item Removed Successfully" };
    // });
    // builder.addCase(removeItem.rejected, (state, { payload, meta, error }) => {
    //   state.loading = "idle";
    //   state.error = error;
    // });
  },
});

export const {
  resetSuccess,
  setSuccess,
  resetError,
  setError,
  resetSelectedLine,
  setSelectedLine,
  setHeaders,
} = transactionsSlice.actions;

// Selectors
export const selectTransactions = (state: RootState) =>
  state.transactions as TransactionsState;

export default transactionsSlice.reducer;
