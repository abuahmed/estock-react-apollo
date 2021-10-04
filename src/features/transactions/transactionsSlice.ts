import { createAsyncThunk, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
//import { store } from "../../app/store";

import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";

import { RootState } from "../../app/store";

import { RejectWithValueType } from "../auth/types/authType";
import {
  DailySummary,
  DailySummaryType,
  InventorySummary,
  LineSummary,
  LineSummaryType,
  TransactionArgs,
  TransactionHeader,
  TransactionLine,
  TransactionsState,
  TransactionStatus,
  TransactionType,
} from "./types/transactionTypes";
import {
  CREATE_UPDATE_HEADER,
  CREATE_UPDATE_LINE,
  POST_HEADER,
  REMOVE_HEADER,
  REMOVE_LINE,
  UN_POST_HEADER,
} from "../../apollo/mutations";
import {
  GET_ALL_TRANSACTIONS,
  GET_DAILY_TRANSACTIONS_SUMMARY,
  GET_INVENTORIES,
  GET_INVENTORY_SUMMARY,
  GET_ITEM_INVENTORY,
  GET_SELECTED_HEADER,
  GET_TOP_ITEMS,
  GET_TRANSACTION_LINES,
} from "../../apollo/queries";
import { Inventory } from "./types/transactionTypes";
import { endOfDay, startOfDay } from "date-fns";
import { sleep } from "../../utils/sleep";

export const fetchInventories = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("transactions/fetchInventories", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    let lastUpdated = startOfDay(new Date());
    if (_arg === "refresh") lastUpdated = new Date();

    const response = await apolloClient.query({
      query: GET_INVENTORIES,
      variables: { lastUpdated: lastUpdated },
    });

    if (response && response.data && response.data.inventories) {
      return response.data.inventories as Inventory[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const fetchHeaders = createAsyncThunk<
  any,
  TransactionArgs,
  { rejectValue: RejectWithValueType }
>("transactions/fetchHeaders", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    let lastUpdated = startOfDay(new Date());
    if (_arg.refreshList === "refresh") lastUpdated = new Date();

    const response = await apolloClient.query({
      query: GET_ALL_TRANSACTIONS,
      variables: {
        ..._arg,
        lastUpdated: lastUpdated,
        durationBegin: startOfDay(_arg.durationBegin as Date).toISOString(),
        durationEnd: endOfDay(_arg.durationEnd as Date).toISOString(),
      },
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
  TransactionArgs,
  { rejectValue: RejectWithValueType }
>("transactions/fetchLines", async (transactionArgs, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  //const { headerId,itemId } = transactionArgs;
  try {
    let lastUpdated = startOfDay(new Date());
    if (transactionArgs.refreshList === "refresh") lastUpdated = new Date();

    const response = await apolloClient.query({
      query: GET_TRANSACTION_LINES,
      variables: {
        ...transactionArgs,
        durationBegin: transactionArgs.durationBegin as Date,
        durationEnd: transactionArgs.durationEnd as Date,
        lastUpdated: lastUpdated,
      },
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
  { rejectValue: RejectWithValueType }
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
  { rejectValue: RejectWithValueType }
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
  { rejectValue: RejectWithValueType }
>("transactions/addLine", async (tranLine, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
  try {
    const { id, item, header, qty, eachPrice, diff } = tranLine;

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
        diff: diff,
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

export const postHeader = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("transactions/postHeader", async (id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    //apolloClient.read.clearStore()
    const response = await apolloClient.mutate({
      mutation: POST_HEADER,
      variables: { id },
    });

    if (response && response.data && response.data.postHeader) {
      const header = response.data.postHeader as TransactionHeader;
      //dispatch(setLines(header.lines as TransactionLine[]));
      return header;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const unPostHeader = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("transactions/unPostHeader", async (id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: UN_POST_HEADER,
      variables: { id },
    });

    if (response && response.data && response.data.unPostHeader) {
      const header = response.data.unPostHeader as TransactionHeader;
      //dispatch(setLines(header.lines as TransactionLine[]));
      return header;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const removeHeader = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
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
  { rejectValue: RejectWithValueType }
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
export const getItemInventory = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("transactions/getItemInventory", async (_id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_ITEM_INVENTORY,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getItemInventory) {
      return response.data.getItemInventory as Inventory;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const getSummary = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("transactions/getSummary", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    //await sleep(5000);
    const response = await apolloClient.query({
      query: GET_INVENTORY_SUMMARY,
    });

    if (response && response.data && response.data.getInventorySummary) {
      return response.data.getInventorySummary as InventorySummary[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const getTopItems = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("transactions/getTopItems", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const includeSales = _arg === "sale" ? true : false;
    const includePurchases = _arg === "purchase" ? true : false;
    const response = await apolloClient.query({
      query: GET_TOP_ITEMS,
      variables: { includePurchases, includeSales },
    });

    if (response && response.data && response.data.topItems) {
      const result = response.data.topItems as LineSummary[];
      return { type: _arg, lineSummary: result } as LineSummaryType;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const GetDailyTransactions = createAsyncThunk<
  any,
  TransactionType,
  { rejectValue: RejectWithValueType }
>("transactions/GetDailyTransactions", async (type, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_DAILY_TRANSACTIONS_SUMMARY,
      variables: { type },
    });

    if (response && response.data && response.data.dailyTransactions) {
      const result = response.data.dailyTransactions as DailySummary[];
      return { type, dailySummary: result } as DailySummaryType;
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
  inventories: [],
  inventorySummary: { totalItems: 0, totalPurchases: 0, totalSales: 0 },
  topPurchasesItems: [],
  topSalesItems: [],
  dailyPurchasesSummary: [],
  dailySalesSummary: [],
  selectedInventory: { id: 0 },
  headers: [],
  lines: [],
  selectedHeader: {
    type: TransactionType.Purchase,
    status: TransactionStatus.Draft,
    transactionDate: new Date(),
  },
  selectedLine: {
    item: { displayName: "select item", id: 0 },
    qty: 0,
    eachPrice: 0,
  },
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

    builder.addCase(getSummary.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(getSummary.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.inventorySummary = payload;
    });
    builder.addCase(getSummary.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(getTopItems.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(getTopItems.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      if (payload.type === "purchase")
        state.topPurchasesItems = payload.lineSummary;
      else state.topSalesItems = payload.lineSummary;
    });
    builder.addCase(getTopItems.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(GetDailyTransactions.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(
      GetDailyTransactions.fulfilled,
      (state, { payload, meta }) => {
        state.loading = "idle";
        if (payload.type === TransactionType.Purchase)
          state.dailyPurchasesSummary = payload.dailySummary;
        else state.dailySalesSummary = payload.dailySummary;
      }
    );
    builder.addCase(GetDailyTransactions.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(fetchInventories.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(fetchInventories.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.inventories = payload;
    });
    builder.addCase(fetchInventories.rejected, (state, { payload }) => {
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

    builder.addCase(getItemInventory.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(getItemInventory.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedInventory = payload;
    });
    builder.addCase(
      getItemInventory.rejected,
      (state, { payload, meta, error }) => {
        state.loading = "idle";
        state.error = payload;
      }
    );

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

    builder.addCase(postHeader.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(postHeader.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedHeader = payload;
      state.success = { message: "Transaction Posted Successfully" };
    });
    builder.addCase(postHeader.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(unPostHeader.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(unPostHeader.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedHeader = payload;
      state.success = { message: "Transaction unPosted Successfully" };
    });
    builder.addCase(unPostHeader.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

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
