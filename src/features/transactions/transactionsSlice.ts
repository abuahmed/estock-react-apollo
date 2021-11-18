import { createAsyncThunk, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
//import { store } from "../../app/store";
import { addMonths, endOfDay, startOfDay } from "date-fns";

import { apolloClient } from "../../apollo/graphql";
import { RootState } from "../../app/store";
import { RejectWithValueType } from "../auth/types/authType";
import {
  DailySummary,
  DailySummaryType,
  InventorySummary,
  LineArgs,
  LineSummary,
  LineSummaryType,
  PaymentArgs,
  TransactionArgs,
  TransactionHeader,
  TransactionLine,
  TransactionsState,
  TransactionStatus,
  TransactionsWithSummary,
  TransactionType,
} from "./types/transactionTypes";
import {
  CREATE_UPDATE_HEADER,
  CREATE_UPDATE_LINE,
  POST_HEADER,
  POST_HEADER_WITH_PAYMENT,
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
  GET_TRANSACTION_PAYMENTS,
} from "../../apollo/queries";
import { Inventory } from "./types/transactionTypes";
import { Payment, PaymentTypes } from "./types/paymentTypes";
//import { sleep } from "../../utils/sleep";

export const fetchInventories = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("transactions/fetchInventories", async (_arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

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
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const fetchHeaders = createAsyncThunk<
  any,
  TransactionArgs,
  { rejectValue: RejectWithValueType }
>("transactions/fetchHeaders", async (headerArg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    let lastUpdated = startOfDay(new Date());
    if (headerArg.refreshList === "refresh") lastUpdated = new Date();

    const response = await apolloClient.query({
      query: GET_ALL_TRANSACTIONS,
      variables: {
        ...headerArg,
        lastUpdated,
        durationBegin: startOfDay(
          headerArg.durationBegin as Date
        ).toISOString(),
        durationEnd: endOfDay(headerArg.durationEnd as Date).toISOString(),
      },
    });

    if (response && response.data && response.data.transactions) {
      return response.data.transactions as TransactionsWithSummary[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const fetchLines = createAsyncThunk<
  any,
  LineArgs,
  { rejectValue: RejectWithValueType }
>("transactions/fetchLines", async (transactionArgs, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    let lastUpdated = startOfDay(new Date());
    if (transactionArgs.refreshList === "refresh") lastUpdated = new Date();
    let tranArgs;
    if (transactionArgs.headerId) {
      tranArgs = { ...transactionArgs }; // { ...transactionArgs, lastUpdated: new Date() };
    } else {
      tranArgs = {
        ...transactionArgs,
        durationBegin: transactionArgs.durationBegin as Date,
        durationEnd: transactionArgs.durationEnd as Date,
        lastUpdated: lastUpdated,
      };
    }

    const response = await apolloClient.query({
      query: GET_TRANSACTION_LINES,
      variables: {
        ...tranArgs,
      },
    });

    if (response && response.data && response.data.lines) {
      return response.data.lines as TransactionLine[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const fetchPayments = createAsyncThunk<
  any,
  PaymentArgs,
  { rejectValue: RejectWithValueType }
>("transactions/fetchPayments", async (paymentArgs, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    //console.log(paymentArgs);
    const response = await apolloClient.query({
      query: GET_TRANSACTION_PAYMENTS,
      variables: {
        ...paymentArgs,
        durationBegin: paymentArgs.durationBegin as Date,
        durationEnd: paymentArgs.durationEnd as Date,
      },
    });

    if (response && response.data && response.data.payments) {
      return response.data.payments as Payment[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const getHeader = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("transactions/getHeader", async (_id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_HEADER,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getHeaderById) {
      return response.data.getHeaderById as TransactionHeader;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const addHeader = createAsyncThunk<
  any,
  TransactionHeader,
  { rejectValue: RejectWithValueType }
>("transactions/addHeader", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const {
      id,
      businessPartner,
      warehouse,
      toWarehouse,
      transactionDate,
      type,
    } = arg;
    let lastUpdated = new Date();
    const durationBegin = addMonths(new Date(), -1);
    if (type === TransactionType.Sale || type === TransactionType.Purchase) {
      if (!businessPartner || businessPartner.id === 0) {
        const message = "Choose Business Partner First";
        await setErrorAction(dispatch, { message });
        return rejectWithValue({ message });
      }
    }
    const bpId =
      businessPartner && businessPartner.id !== 0 ? businessPartner.id : null;
    const toWareId =
      toWarehouse && toWarehouse.id !== 0 ? toWarehouse.id : null;

    const response = await apolloClient.mutate({
      mutation: CREATE_UPDATE_HEADER,
      variables: {
        type,
        id,
        businessPartnerId: bpId,
        warehouseId: warehouse?.id,
        toWarehouseId: toWareId,
        transactionDate,
      },
      refetchQueries: [
        {
          query: GET_ALL_TRANSACTIONS,
          variables: {
            type: type,
            lastUpdated: lastUpdated,
            durationBegin: startOfDay(durationBegin as Date).toISOString(),
            durationEnd: endOfDay(lastUpdated as Date).toISOString(),
          },
        },
      ],
    });

    if (response && response.data && response.data.createTransaction) {
      const addedItem = (await response.data
        .createTransaction) as TransactionHeader;

      await setSuccessAction(dispatch, {
        message: "Transaction Successfully Saved",
      });

      return addedItem;
    }
  } catch (error: any) {
    const message = error.message;
    dispatch(setSelectedHeader(arg));
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const addLine = createAsyncThunk<
  any,
  TransactionLine,
  { rejectValue: RejectWithValueType }
>("transactions/addLine", async (tranLine, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const { id, item, header, qty, eachPrice, diff } = tranLine;
    const { businessPartner, toWarehouse } = header as TransactionHeader;
    if (
      header?.type === TransactionType.Sale ||
      header?.type === TransactionType.Purchase
    ) {
      if (!businessPartner || businessPartner.id === 0) {
        const message = "Choose Business Partner First";
        await setErrorAction(dispatch, { message });
        return rejectWithValue({ message });
      }
    }
    const bpId =
      businessPartner && businessPartner.id !== 0 ? businessPartner.id : null;
    const toWareId =
      toWarehouse && toWarehouse.id !== 0 ? toWarehouse.id : null;
    const response = await apolloClient.mutate({
      mutation: CREATE_UPDATE_LINE,
      variables: {
        id: id,
        headerId: header?.id,
        type: header?.type,
        transactionDate: header?.transactionDate,
        businessPartnerId: bpId,
        warehouseId: header?.warehouse?.id,
        toWarehouseId: toWareId,
        itemId: item?.id,
        qty: qty,
        eachPrice: eachPrice,
        diff: diff,
      },
      refetchQueries: [
        {
          query: GET_TRANSACTION_LINES,
          variables: {
            headerId: header?.id,
          },
        },
      ],
    });

    if (response && response.data && response.data.createUpdateLine) {
      const addedLine = (await response.data
        .createUpdateLine) as TransactionLine;

      // await setSuccessAction(dispatch, {
      //   message: `Item Successfully Added`,
      // });

      return addedLine;
    }
  } catch (error: any) {
    const message = error.message;
    dispatch(setSelectedLine(tranLine));
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const postHeaderWithPayment = createAsyncThunk<
  any,
  Payment,
  { rejectValue: RejectWithValueType }
>("transactions/postHeaderWithPayment", async (payment, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const { type, headerId, paymentDate, amount, amountRequired } = payment;
    const response = await apolloClient.mutate({
      mutation: POST_HEADER_WITH_PAYMENT,
      variables: { type, headerId, paymentDate, amount, amountRequired },
    });

    if (response && response.data && response.data.postHeaderWithPayment) {
      const header = response.data.postHeaderWithPayment as TransactionHeader;
      await setSuccessAction(dispatch, {
        message: "Transaction Successfully Posted",
      });

      return header;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const postHeader = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("transactions/postHeader", async (id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    console.log(id);
    const response = await apolloClient.mutate({
      mutation: POST_HEADER,
      variables: { id },
    });

    if (response && response.data && response.data.postHeader) {
      const header = response.data.postHeader as TransactionHeader;
      //dispatch(setLines(header.lines as TransactionLine[]));
      await setSuccessAction(dispatch, {
        message: "Transaction Successfully Posted",
      });
      return header;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
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
      await setSuccessAction(dispatch, {
        message: "Transaction Successfully UnPosted",
      });
      return header;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const removeHeader = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("transactions/removeHeader", async (id, thunkAPI) => {
  const { getState, rejectWithValue, dispatch } = thunkAPI;
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
      await setSuccessAction(dispatch, {
        message: "Transaction Successfully Removed",
      });
      return restItems as TransactionHeader[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const removeLine = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("transactions/removeLine", async (id, thunkAPI) => {
  const { getState, rejectWithValue, dispatch } = thunkAPI;
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
      await setSuccessAction(dispatch, {
        message: "Transaction Items Successfully Removed",
      });
      return restItems as TransactionLine[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const getItemInventory = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("transactions/getItemInventory", async (_id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_ITEM_INVENTORY,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getItemInventory) {
      return response.data.getItemInventory as Inventory;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const getSummary = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("transactions/getSummary", async (_arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    //await sleep(5000);
    const response = await apolloClient.query({
      query: GET_INVENTORY_SUMMARY,
    });

    if (response && response.data && response.data.getInventorySummary) {
      return response.data.getInventorySummary as InventorySummary[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const getTopItems = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("transactions/getTopItems", async (_arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

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
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const GetDailyTransactions = createAsyncThunk<
  any,
  TransactionType,
  { rejectValue: RejectWithValueType }
>("transactions/GetDailyTransactions", async (type, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

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
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
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

const defaultLine: TransactionLine = {
  item: { displayName: "select item", id: 0 },
  qty: 0,
  eachPrice: 0,
};
const defaultPayment: Payment = {
  paymentDate: new Date(),
  amount: 0,
  amountRequired: 0,
  type: PaymentTypes.Sale,
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
  headersWithSummary: {},
  lines: [],
  payments: [],
  selectedHeader: {
    type: TransactionType.Purchase,
    status: TransactionStatus.Draft,
    transactionDate: new Date(),
    businessPartner: { displayName: "select customer/vendor", id: 0 },
    warehouse: { displayName: "Warehouse", id: 0 },
    toWarehouse: { displayName: "Destination", id: 0 },
  },
  selectedLine: { ...defaultLine },
  selectedPayment: { ...defaultPayment },
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
      state.selectedLine = { ...defaultLine };
    },
    setSelectedLine: (state, { payload }) => {
      state.selectedLine = payload;
    },
    setSelectedPayment: (state, { payload }) => {
      state.selectedPayment = payload; //{ ...defaultPayment, ...payload };
    },

    resetSelectedPayment: (state, { payload }) => {
      state.selectedPayment = payload;
    },
    resetPayments: (state) => {
      state.payments = [];
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
    builder.addCase(fetchHeaders.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchHeaders.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.headersWithSummary = payload;
      // if (payload.length > 0) state.selectedHeader = payload[0];
    });
    builder.addCase(fetchHeaders.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(getSummary.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getSummary.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.inventorySummary = payload;
    });
    builder.addCase(getSummary.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(getTopItems.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getTopItems.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      if (payload.type === "purchase")
        state.topPurchasesItems = payload.lineSummary;
      else state.topSalesItems = payload.lineSummary;
    });
    builder.addCase(getTopItems.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(GetDailyTransactions.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(GetDailyTransactions.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      if (payload.type === TransactionType.Purchase)
        state.dailyPurchasesSummary = payload.dailySummary;
      else state.dailySalesSummary = payload.dailySummary;
    });
    builder.addCase(GetDailyTransactions.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(fetchInventories.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchInventories.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.inventories = payload;
    });
    builder.addCase(fetchInventories.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(fetchLines.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchLines.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.lines = payload;
    });
    builder.addCase(fetchLines.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(fetchPayments.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchPayments.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.payments = payload;
    });
    builder.addCase(fetchPayments.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(getHeader.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getHeader.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedHeader = payload;
    });
    builder.addCase(getHeader.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(getItemInventory.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getItemInventory.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedInventory = payload;
    });
    builder.addCase(getItemInventory.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addLine.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addLine.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedHeader = payload.header;
      state.lines = state.lines.filter((c) => c.id !== payload.id);
      state.lines.unshift(payload);
    });
    builder.addCase(addLine.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeHeader.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeHeader.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.headers = payload;
      state.success = { message: "Transactions Removed Successfully" };
    });
    builder.addCase(removeHeader.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(postHeader.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(postHeader.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedHeader = payload;
    });
    builder.addCase(postHeader.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(postHeaderWithPayment.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(postHeaderWithPayment.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedHeader = payload;
    });
    builder.addCase(postHeaderWithPayment.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(unPostHeader.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(unPostHeader.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedHeader = payload;
    });
    builder.addCase(unPostHeader.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeLine.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeLine.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.lines = payload;
    });
    builder.addCase(removeLine.rejected, (state) => {
      state.loading = "idle";
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
  setSelectedPayment,
  resetSelectedPayment,
  resetPayments,
  setHeaders,
  resetHeaders,
  setLines,
  resetLines,
} = transactionsSlice.actions;

// Selectors
export const selectTransactions = (state: RootState) =>
  state.transactions as TransactionsState;

export default transactionsSlice.reducer;
