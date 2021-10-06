import { createAsyncThunk, createSlice, ThunkDispatch } from "@reduxjs/toolkit";

import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";
import {
  ADD_UPDATE_BUSINESS_PARTNER,
  REMOVE_BUSINESS_PARTNER,
} from "../../apollo/mutations";
import {
  GET_ALL_BUSINESS_PARTNERS,
  GET_SELECTED_BUSINESS_PARTNER,
} from "../../apollo/queries";

import { RootState } from "../../app/store";
//import { sleep } from "../../utils/sleep";

import { RejectWithValueType } from "../auth/types/authType";
import { BusinessPartnerType } from "../transactions/types/transactionTypes";
import {
  BusinessPartner,
  BusinessPartnersState,
  RemoveBusinessPartner,
} from "./types/bpTypes";

export const fetchBusinessPartners = createAsyncThunk<
  any,
  BusinessPartnerType,
  { rejectValue: RejectWithValueType }
>("BusinessPartners/fetchBusinessPartners", async (type, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    //await sleep(5000);
    const response = await apolloClient.query({
      query: GET_ALL_BUSINESS_PARTNERS,
      variables: { type },
    });

    if (response && response.data && response.data.businessPartners) {
      return response.data.businessPartners as BusinessPartner[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const getBusinessPartner = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("BusinessPartners/getBusinessPartner", async (_id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_BUSINESS_PARTNER,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getBusinessPartner) {
      return response.data.getBusinessPartner as BusinessPartner;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const addBusinessPartner = createAsyncThunk<
  any,
  BusinessPartner,
  { rejectValue: RejectWithValueType }
>("BusinessPartners/addBusinessPartner", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    let bp = { ...arg };
    //console.log({ ...businessPartner });
    const { address, contact } = bp;

    const response = await apolloClient.mutate({
      mutation: ADD_UPDATE_BUSINESS_PARTNER,
      variables: {
        id: bp.id,
        type: bp.type,
        displayName: bp.displayName,
        initialOutstandingCredit: bp.initialOutstandingCredit,
        creditLimit: bp.creditLimit,
        creditTransactionsLimit: bp.creditTransactionsLimit,
        addressId: address?.id,
        mobile: address?.mobile,
        telephone: address?.telephone,
        email: address?.email,
        contactId: contact?.id,
        fullName: contact?.fullName,
        contactAddressId: contact?.address?.id,
        contactMobile: contact?.address?.mobile,
        contactTelephone: contact?.address?.telephone,
        contactEmail: contact?.address?.email,
      },
      refetchQueries: [
        { query: GET_ALL_BUSINESS_PARTNERS, variables: { type: bp.type } },
      ],
    });

    if (response && response.data && response.data.createBusinessPartner) {
      const addedBusinessPartner = (await response.data
        .createBusinessPartner) as BusinessPartner;

      await setSuccessAction(dispatch, {
        message: "BusinessPartner Successfully Saved",
        type: bp.type,
      });

      return addedBusinessPartner;
    }
    // return businessPartner;
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    dispatch(setSelectedBusinessPartner(arg));
    await setErrorAction(dispatch, { message });
    //console.log(error.graphQLErrors[0].message);
    //error.graphQLErrors[0].extensions.exception.response.status;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const removeBusinessPartner = createAsyncThunk<
  any,
  RemoveBusinessPartner,
  { rejectValue: RejectWithValueType }
>("BusinessPartners/removeBusinessPartner", async ({ id, type }, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_BUSINESS_PARTNER,
      variables: { id },
      refetchQueries: [
        { query: GET_ALL_BUSINESS_PARTNERS, variables: { type } },
      ],
    });

    if (response && response.data && response.data.removeBusinessPartner) {
      const {
        businessPartners: { businessPartners },
      } = getState() as { businessPartners: BusinessPartnersState };
      let restBusinessPartners = [...businessPartners];
      restBusinessPartners = restBusinessPartners.filter(
        (BusinessPartner) => BusinessPartner.id !== id
      );
      dispatch(setBusinessPartners(restBusinessPartners));
      return restBusinessPartners as BusinessPartner[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

async function setSuccessAction(
  dispatch: ThunkDispatch<any, BusinessPartner, any>,
  payload: any
) {
  dispatch(setSuccess(payload));
  setTimeout(() => {
    dispatch(resetSelectedBusinessPartner(payload.type));
    dispatch(resetSuccess());
  }, 2000);
}
async function setErrorAction(
  dispatch: ThunkDispatch<any, BusinessPartner, any>,
  payload: any
) {
  dispatch(setError(payload));
  setTimeout(() => {
    dispatch(resetError());
  }, 6000);
}

const defaultValues: BusinessPartner = {
  type: BusinessPartnerType.Customer,
  displayName: "",
  description: "",
  initialOutstandingCredit: 0,
  creditLimit: 0,
  creditTransactionsLimit: 0,
  address: { mobile: "", telephone: "", email: "" },
  contact: { fullName: "", address: { mobile: "", telephone: "", email: "" } },
};

const initialState: BusinessPartnersState = {
  businessPartners: [],
  selectedBusinessPartner: { ...defaultValues },
  loading: "idle",
  currentRequestId: undefined,
  success: null,
  error: null,
};

export const businessPartnersSlice = createSlice({
  name: "businessPartners",
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
    resetSelectedBusinessPartner: (state, { payload }) => {
      state.selectedBusinessPartner = { ...defaultValues, type: payload.type };
    },
    setSelectedBusinessPartner: (state, { payload }) => {
      state.selectedBusinessPartner = payload;
    },
    setBusinessPartners: (state, { payload }) => {
      state.businessPartners = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBusinessPartners.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchBusinessPartners.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.businessPartners = payload;
    });
    builder.addCase(
      fetchBusinessPartners.rejected,
      (state, { payload, error }) => {
        state.loading = "idle";
        state.error = error;
      }
    );

    builder.addCase(getBusinessPartner.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getBusinessPartner.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedBusinessPartner = payload;
    });
    builder.addCase(
      getBusinessPartner.rejected,
      (state, { payload, error }) => {
        state.loading = "idle";
        //state.error = error;
      }
    );

    builder.addCase(addBusinessPartner.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addBusinessPartner.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedBusinessPartner = payload;
      //state.success = true;
    });
    builder.addCase(
      addBusinessPartner.rejected,
      (state, { payload, error }) => {
        state.loading = "idle";
        //state.error = payload;
      }
    );

    builder.addCase(removeBusinessPartner.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeBusinessPartner.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.businessPartners = payload;
      state.success = { message: "BusinessPartner Removed Successfully" };
    });
    builder.addCase(
      removeBusinessPartner.rejected,
      (state, { payload, error }) => {
        state.loading = "idle";
        state.error = error;
      }
    );
  },
});

export const {
  resetSuccess,
  setSuccess,
  resetError,
  setError,
  resetSelectedBusinessPartner,
  setSelectedBusinessPartner,
  setBusinessPartners,
} = businessPartnersSlice.actions;

// Selectors
export const selectBusinessPartners = (state: RootState) =>
  state.businessPartners as BusinessPartnersState;

export default businessPartnersSlice.reducer;
