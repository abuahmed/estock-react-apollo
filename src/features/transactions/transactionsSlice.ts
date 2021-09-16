import { createAsyncThunk, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
//import { store } from "../../app/store";

import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";

import { RootState } from "../../app/store";

import { AuthError } from "../auth/types/authType";
import {
  TransactionHeader,
  TransactionLine,
  TransactionsState,
  TransactionType,
} from "./types/transactionTypes";
import {
  CREATE_UPDATE_HEADER,
  CREATE_UPDATE_LINE,
  REMOVE_HEADER,
  REMOVE_LINE,
} from "../../apollo/mutations";
import {
  GET_ALL_TRANSACTIONS,
  GET_SELECTED_HEADER,
  GET_TRANSACTION_LINES,
} from "../../apollo/queries";

export const fetchHeaders = createAsyncThunk<
  any,
  TransactionType,
  { rejectValue: AuthError }
>("transactions/fetchHeaders", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

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

export const fetchLines = createAsyncThunk<
  any,
  number,
  { rejectValue: AuthError }
>("transactions/fetchLines", async (headerId, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_TRANSACTION_LINES,
      variables: { headerId },
    });

    if (response && response.data && response.data.lines) {
      return response.data.lines as TransactionLine[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const getHeader = createAsyncThunk<
  any,
  number,
  { rejectValue: AuthError }
>("transactions/getHeader", async (_id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_HEADER,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getHeaderById) {
      return response.data.getHeaderById as TransactionHeader;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const addHeader = createAsyncThunk<
  any,
  TransactionHeader,
  { rejectValue: AuthError }
>("transactions/addHeader", async (arg, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_UPDATE_HEADER,
      variables: {
        ...arg,
      },
    });

    if (response && response.data && response.data.createUpdateHeader) {
      const {
        transactions: { headers },
      } = getState() as { transactions: TransactionsState };
      let restItems = [...headers];
      const addedItem = (await response.data
        .createUpdateHeader) as TransactionHeader;
      if (arg && arg.id) {
        restItems = restItems.filter((it) => it.id !== arg.id);
      }
      restItems.push(addedItem);
      dispatch(setHeaders(restItems));
      await setSuccessAction(dispatch, {
        message: "Item Successfully Saved",
      });

      return addedItem;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    dispatch(setSelectedHeader(arg));
    await setErrorAction(dispatch, { message });

    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const addLine = createAsyncThunk<
  any,
  TransactionLine,
  { rejectValue: AuthError }
>("transactions/addLine", async (tranLine, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
  try {
    const { id, item, header, qty, eachPrice } = tranLine;

    //console.log(tranLine);
    const response = await apolloClient.mutate({
      mutation: CREATE_UPDATE_LINE,
      variables: {
        id: id,
        headerId: header?.id,
        type: header?.type,
        transactionDate: header?.transactionDate,
        businessPartnerId: 1,
        warehouseId: 3,
        itemId: item?.id,
        qty: qty,
        eachPrice: eachPrice,
      },
    });
    //console.log(response.errors[0]?.message);

    if (response && response.data && response.data.createUpdateLine) {
      const {
        transactions: { lines },
      } = getState() as { transactions: TransactionsState };
      let restItems = [...lines];
      const addedLine = (await response.data
        .createUpdateLine) as TransactionLine;
      if (tranLine && tranLine.id) {
        restItems = restItems.filter((it) => it.id !== tranLine.id);
      }
      restItems.push(addedLine);
      dispatch(setLines(restItems));
      //dispatch(setSelectedHeader(addedLine.header));
      await setSuccessAction(dispatch, {
        message: `Item Successfully Added`,
      });

      return addedLine.header;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    dispatch(setSelectedLine(tranLine));
    await setErrorAction(dispatch, { message });

    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const removeHeader = createAsyncThunk<
  any,
  number,
  { rejectValue: AuthError }
>("transactions/removeHeader", async (id, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_HEADER,
      variables: { id },
    });

    if (response && response.data && response.data.removeHeader) {
      const {
        transactions: { headers },
      } = getState() as { transactions: TransactionsState };
      let restItems = [...headers];
      restItems = restItems.filter((item) => item.id !== id);
      dispatch(setHeaders(restItems));
      return restItems as TransactionHeader[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const removeLine = createAsyncThunk<
  any,
  number,
  { rejectValue: AuthError }
>("transactions/removeLine", async (id, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_LINE,
      variables: { id },
    });

    if (response && response.data && response.data.removeLine) {
      const {
        transactions: { lines },
      } = getState() as { transactions: TransactionsState };
      let restItems = [...lines];
      restItems = restItems.filter((item) => item.id !== id);
      dispatch(setLines(restItems));
      dispatch(
        setSelectedHeader(response.data.removeLine as TransactionHeader)
      );

      return restItems as TransactionLine[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

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
  item: { displayName: "select item", id: 0 },
  qty: 0,
  eachPrice: 0,
};

const initialState: TransactionsState = {
  headers: [],
  lines: [],
  selectedHeader: { type: TransactionType.Purchase },
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
    resetSelectedHeader: (state) => {
      state.selectedHeader = { type: TransactionType.Purchase };
    },
    setSelectedHeader: (state, { payload }) => {
      state.selectedHeader = payload;
    },
    resetHeaders: (state) => {
      state.headers = [];
    },
    setHeaders: (state, { payload }) => {
      state.headers = payload;
    },
    resetLines: (state) => {
      state.lines = [];
    },
    setLines: (state, { payload }) => {
      state.lines = payload;
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

    builder.addCase(fetchLines.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(fetchLines.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.lines = payload;
    });
    builder.addCase(fetchLines.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(getHeader.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(getHeader.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedHeader = payload;
    });
    builder.addCase(getHeader.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(addLine.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(addLine.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedHeader = payload;
    });
    builder.addCase(addLine.rejected, (state, { payload, meta, error }) => {
      //console.log(payload);
      state.loading = "idle";
      //state.error = payload;
    });

    builder.addCase(removeHeader.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(removeHeader.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.headers = payload;
      state.success = { message: "Transactions Removed Successfully" };
    });
    builder.addCase(
      removeHeader.rejected,
      (state, { payload, meta, error }) => {
        state.loading = "idle";
        state.error = payload;
      }
    );

    builder.addCase(removeLine.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(removeLine.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.lines = payload;
      state.success = { message: "Transaction Items Removed Successfully" };
    });
    builder.addCase(removeLine.rejected, (state, { payload, meta, error }) => {
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
  resetSelectedLine,
  setSelectedLine,
  resetSelectedHeader,
  setSelectedHeader,
  setHeaders,
  resetHeaders,
  setLines,
  resetLines,
} = transactionsSlice.actions;

// Selectors
export const selectTransactions = (state: RootState) =>
  state.transactions as TransactionsState;

export default transactionsSlice.reducer;
