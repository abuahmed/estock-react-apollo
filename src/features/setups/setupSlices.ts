import { createAsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";
import {
  Category,
  CategoryType,
  Item,
  ItemsState,
  RemoveCategory,
} from "./types/itemTypes";
import { BusinessPartnerType } from "./types/bpTypes";
import {
  BusinessPartner,
  SetupsState,
  RemoveBusinessPartner,
} from "./types/bpTypes";
import { RootState } from "../../app/store";
import { Client, Organization, Warehouse } from "./types/warehouseTypes";
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
import {
  ADD_UPDATE_BUSINESS_PARTNER,
  REMOVE_BUSINESS_PARTNER,
} from "../../apollo/mutations";
import {
  ADD_UPDATE_CLIENT,
  ADD_UPDATE_ORGANIZATION,
  ADD_UPDATE_WAREHOUSE,
  REMOVE_CLIENT,
  REMOVE_ORGANIZATION,
  REMOVE_WAREHOUSE,
} from "../../apollo/mutations/warehouse";
import {
  GET_ALL_BUSINESS_PARTNERS,
  GET_SELECTED_BUSINESS_PARTNER,
} from "../../apollo/queries";
import {
  GET_ALL_CLIENTS,
  GET_ALL_ORGANIZATIONS,
  GET_ALL_WAREHOUSES,
  GET_SELECTED_CLIENT,
  GET_SELECTED_ORGANIZATION,
  GET_SELECTED_WAREHOUSE,
} from "../../apollo/queries/warehouse";

import { RejectWithValueType } from "../auth/types/authType";

export const fetchItems = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("setups/fetchItems", async (_arg, thunkAPI) => {
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
>("setups/fetchCategories", async (categoryType, thunkAPI) => {
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
>("setups/getItem", async (_id, thunkAPI) => {
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
>("setups/addItem", async (arg, thunkAPI) => {
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
        setupType: "Item",
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
>("setups/addCategory", async (category, thunkAPI) => {
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
>("setups/removeItem", async (id, thunkAPI) => {
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
>("setups/removeCategory", async (category, thunkAPI) => {
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

export const fetchBusinessPartners = createAsyncThunk<
  any,
  BusinessPartnerType,
  { rejectValue: RejectWithValueType }
>("setups/fetchBusinessPartners", async (type, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
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
>("setups/getBusinessPartner", async (_id, thunkAPI) => {
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
>("setups/addBusinessPartner", async (arg, thunkAPI) => {
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
        setupType: "BusinessPartner",
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

    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const removeBusinessPartner = createAsyncThunk<
  any,
  RemoveBusinessPartner,
  { rejectValue: RejectWithValueType }
>("setups/removeBusinessPartner", async ({ id, type }, thunkAPI) => {
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
      } = getState() as { businessPartners: SetupsState };
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

export const fetchClients = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("setups/fetchClients", async (arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_CLIENTS,
    });

    if (response && response.data && response.data.clients) {
      return response.data.clients as Client[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const getClient = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/getClient", async (_id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_CLIENT,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getClient) {
      return response.data.getClient as Client;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const addClient = createAsyncThunk<
  any,
  Client,
  { rejectValue: RejectWithValueType }
>("setups/addClient", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    let client = { ...arg };
    const { address } = client;

    const response = await apolloClient.mutate({
      mutation: ADD_UPDATE_CLIENT,
      variables: {
        id: client.id,
        displayName: client.displayName,
        addressId: address?.id,
        mobile: address?.mobile,
        telephone: address?.telephone,
        email: address?.email,
      },
      refetchQueries: [{ query: GET_ALL_CLIENTS }],
    });

    if (response && response.data && response.data.createUpdateClient) {
      const addedClient = (await response.data.createUpdateClient) as Client;

      await setSuccessAction(dispatch, {
        message: "Client Successfully Saved",
        setupType: "Client",
      });

      return addedClient;
    }
    // return businessPartner;
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    dispatch(setSelectedClient(arg));
    await setErrorAction(dispatch, { message });

    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const removeClient = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/removeClient", async (id, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_CLIENT,
      variables: { id },
      refetchQueries: [{ query: GET_ALL_CLIENTS }],
    });

    if (response && response.data && response.data.removeClient) {
      const {
        setups: { clients },
      } = getState() as { setups: SetupsState };
      let restClients = [...clients];
      restClients = restClients.filter((Client) => Client.id !== id);
      dispatch(setClients(restClients));
      return restClients as Client[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const fetchOrganizations = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/fetchOrganizations", async (clientId, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_ORGANIZATIONS,
      variables: { clientId },
    });

    if (response && response.data && response.data.organizations) {
      return response.data.organizations as Organization[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const getOrganization = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/getOrganization", async (_id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_ORGANIZATION,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getOrganization) {
      return response.data.getOrganization as Organization;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const addOrganization = createAsyncThunk<
  any,
  Organization,
  { rejectValue: RejectWithValueType }
>("setups/addOrganization", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    let org = { ...arg };
    const { address } = org;

    const response = await apolloClient.mutate({
      mutation: ADD_UPDATE_ORGANIZATION,
      variables: {
        id: org.id,
        clientId: org.clientId,
        displayName: org.displayName,
        addressId: address?.id,
        mobile: address?.mobile,
        telephone: address?.telephone,
        email: address?.email,
      },
      refetchQueries: [
        {
          query: GET_ALL_ORGANIZATIONS,
          variables: { clientId: org.clientId },
        },
      ],
    });

    if (response && response.data && response.data.createUpdateOrganization) {
      const addedOrganization = (await response.data
        .createUpdateOrganization) as Organization;

      await setSuccessAction(dispatch, {
        message: "Organization Successfully Saved",
        setupType: "Organization",
      });

      return addedOrganization;
    }
    // return businessPartner;
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    dispatch(setSelectedOrganization(arg));
    await setErrorAction(dispatch, { message });

    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const removeOrganization = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/removeOrganization", async (id, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_ORGANIZATION,
      variables: { id },
      refetchQueries: [{ query: GET_ALL_ORGANIZATIONS }],
    });

    if (response && response.data && response.data.removeOrganization) {
      const {
        setups: { organizations },
      } = getState() as { setups: SetupsState };
      let restOrganizations = [...organizations];
      restOrganizations = restOrganizations.filter(
        (Organization) => Organization.id !== id
      );
      dispatch(setOrganizations(restOrganizations));
      return restOrganizations as Organization[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const fetchWarehouses = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/fetchWarehouses", async (organizationId, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_WAREHOUSES,
      variables: { organizationId },
    });

    if (response && response.data && response.data.warehouses) {
      return response.data.warehouses as Warehouse[];
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const getWarehouse = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/getWarehouse", async (_id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_WAREHOUSE,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getWarehouse) {
      return response.data.getWarehouse as Warehouse;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const addWarehouse = createAsyncThunk<
  any,
  Warehouse,
  { rejectValue: RejectWithValueType }
>("setups/addWarehouse", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    let org = { ...arg };
    const { address } = org;

    const response = await apolloClient.mutate({
      mutation: ADD_UPDATE_WAREHOUSE,
      variables: {
        id: org.id,
        organizationId: org.organizationId,
        displayName: org.displayName,
        addressId: address?.id,
        mobile: address?.mobile,
        telephone: address?.telephone,
        email: address?.email,
      },
      refetchQueries: [
        {
          query: GET_ALL_WAREHOUSES,
          variables: { organizationId: org.organizationId },
        },
      ],
    });

    if (response && response.data && response.data.createUpdateWarehouse) {
      const addedWarehouse = (await response.data
        .createUpdateWarehouse) as Warehouse;

      await setSuccessAction(dispatch, {
        message: "Warehouse Successfully Saved",
        setupType: "Warehouse",
      });

      return addedWarehouse;
    }
    // return businessPartner;
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    dispatch(setSelectedWarehouse(arg));
    await setErrorAction(dispatch, { message });

    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const removeWarehouse = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/removeWarehouse", async (id, thunkAPI) => {
  const { rejectWithValue, getState, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_WAREHOUSE,
      variables: { id },
      refetchQueries: [{ query: GET_ALL_WAREHOUSES }],
    });

    if (response && response.data && response.data.removeWarehouse) {
      const {
        setups: { warehouses },
      } = getState() as { setups: SetupsState };
      let restWarehouses = [...warehouses];
      restWarehouses = restWarehouses.filter(
        (Warehouse) => Warehouse.id !== id
      );
      dispatch(setWarehouses(restWarehouses));
      return restWarehouses as Warehouse[];
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
    switch (payload.setupType) {
      case "BusinessPartner":
        dispatch(resetSelectedBusinessPartner(payload.type));
        break;
      case "Item":
        dispatch(resetSelectedItem());
        break;
      case "Client":
        dispatch(resetSelectedClient());
        break;
      case "Organization":
        dispatch(resetSelectedOrganization());
        break;
      case "Warehouse":
        dispatch(resetSelectedWarehouse());
        break;
    }
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
const defaultItem: Item = {
  displayName: "",
  description: "",
  itemCategoryId: 0,
  unitOfMeasureId: 0,
  purchasePrice: 0,
  sellingPrice: 0,
  safeQty: 0,
};
const defaultBusinessPartner: BusinessPartner = {
  type: BusinessPartnerType.Customer,
  displayName: "",
  description: "",
  initialOutstandingCredit: 0,
  creditLimit: 0,
  creditTransactionsLimit: 0,
  address: { mobile: "", telephone: "", email: "" },
  contact: { fullName: "", address: { mobile: "", telephone: "", email: "" } },
};
const defaultClient: Client = {
  displayName: "",
  description: "",
  address: { mobile: "", telephone: "", email: "" },
};
const defaultOrganization: Organization = {
  displayName: "",
  description: "",
  address: { mobile: "", telephone: "", email: "" },
};
const defaultWarehouse: Warehouse = {
  displayName: "",
  description: "",
  address: { mobile: "", telephone: "", email: "" },
};

const initialSetupsState: SetupsState = {
  items: [],
  categories: [],
  uoms: [],
  selectedItem: { ...defaultItem },
  businessPartners: [],
  selectedBusinessPartner: { ...defaultBusinessPartner },
  clients: [],
  selectedClient: { ...defaultClient },
  organizations: [],
  selectedOrganization: { ...defaultOrganization },
  warehouses: [],
  selectedWarehouse: { ...defaultWarehouse },
  loading: "idle",
  currentRequestId: undefined,
  success: null,
  error: null,
};

export const setupsSlice = createSlice({
  name: "setups",
  initialState: initialSetupsState,
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
      state.selectedItem = { ...defaultItem };
    },
    setSelectedItem: (state, { payload }) => {
      state.selectedItem = payload;
    },
    setItems: (state, { payload }) => {
      state.items = payload;
    },
    resetSelectedBusinessPartner: (state, { payload }) => {
      state.selectedBusinessPartner = {
        ...defaultBusinessPartner,
        type: payload.type,
      };
    },
    setSelectedBusinessPartner: (state, { payload }) => {
      state.selectedBusinessPartner = payload;
    },
    setBusinessPartners: (state, { payload }) => {
      state.businessPartners = payload;
    },
    setSelectedClient: (state, { payload }) => {
      state.selectedClient = payload;
    },
    setClients: (state, { payload }) => {
      state.clients = payload;
    },
    resetSelectedClient: (state) => {
      state.selectedClient = {
        ...defaultClient,
      };
    },
    setSelectedOrganization: (state, { payload }) => {
      state.selectedOrganization = payload;
    },
    setOrganizations: (state, { payload }) => {
      state.organizations = payload;
    },
    resetSelectedOrganization: (state) => {
      state.selectedOrganization = {
        ...defaultOrganization,
      };
    },
    setSelectedWarehouse: (state, { payload }) => {
      state.selectedWarehouse = payload;
    },
    setWarehouses: (state, { payload }) => {
      state.warehouses = payload;
    },
    resetSelectedWarehouse: (state) => {
      state.selectedWarehouse = {
        ...defaultWarehouse,
      };
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
    builder.addCase(fetchBusinessPartners.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchBusinessPartners.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.businessPartners = payload;
    });
    builder.addCase(fetchBusinessPartners.rejected, (state, { error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(getBusinessPartner.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getBusinessPartner.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedBusinessPartner = payload;
    });
    builder.addCase(getBusinessPartner.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addBusinessPartner.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addBusinessPartner.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedBusinessPartner = payload;
    });
    builder.addCase(addBusinessPartner.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeBusinessPartner.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeBusinessPartner.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.businessPartners = payload;
      state.success = { message: "BusinessPartner Removed Successfully" };
    });
    builder.addCase(removeBusinessPartner.rejected, (state, { error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(fetchClients.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchClients.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.clients = payload;
    });
    builder.addCase(fetchClients.rejected, (state, { error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(getClient.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getClient.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedClient = payload;
    });
    builder.addCase(getClient.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addClient.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addClient.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedClient = payload;
      state.clients = state.clients.filter((c) => c.id !== payload.id);
      state.clients.unshift(payload);
    });
    builder.addCase(addClient.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeClient.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeClient.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.clients = payload;
      state.success = { message: "Client Removed Successfully" };
    });
    builder.addCase(removeClient.rejected, (state, { error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(fetchOrganizations.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchOrganizations.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.organizations = payload;
    });
    builder.addCase(fetchOrganizations.rejected, (state, { error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(getOrganization.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getOrganization.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedOrganization = payload;
    });
    builder.addCase(getOrganization.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addOrganization.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addOrganization.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedOrganization = payload;
    });
    builder.addCase(addOrganization.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeOrganization.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeOrganization.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.organizations = payload;
      state.success = { message: "Organization Removed Successfully" };
    });
    builder.addCase(removeOrganization.rejected, (state, { error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(fetchWarehouses.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchWarehouses.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.warehouses = payload;
    });
    builder.addCase(fetchWarehouses.rejected, (state, { error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(getWarehouse.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getWarehouse.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedWarehouse = payload;
    });
    builder.addCase(getWarehouse.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addWarehouse.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addWarehouse.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedWarehouse = payload;
    });
    builder.addCase(addWarehouse.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeWarehouse.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeWarehouse.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.warehouses = payload;
      state.success = { message: "Warehouse Removed Successfully" };
    });
    builder.addCase(removeWarehouse.rejected, (state, { error }) => {
      state.loading = "idle";
      state.error = error;
    });
  },
});
const { actions, reducer } = setupsSlice;
export const {
  resetSuccess,
  setSuccess,
  resetError,
  setError,
  resetSelectedItem,
  setSelectedItem,
  setItems,
  resetSelectedBusinessPartner,
  setSelectedBusinessPartner,
  setBusinessPartners,
  resetSelectedClient,
  setSelectedClient,
  setClients,
  resetSelectedOrganization,
  setSelectedOrganization,
  setOrganizations,
  resetSelectedWarehouse,
  setSelectedWarehouse,
  setWarehouses,
} = actions;

export default reducer;

// Selectors
export const selectSetups = (state: RootState) => state.setups as SetupsState;
