import { createAsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { apolloClient } from "../../apollo/graphql";
import {
  Category,
  CategoryType,
  Item,
  RemoveCategory,
} from "./types/itemTypes";
import {
  BusinessPartnerType,
  BusinessPartner,
  SetupsState,
  RemoveBusinessPartner,
} from "./types/bpTypes";
import {
  Client,
  FetchWarehousesOptions,
  Organization,
  Warehouse,
} from "./types/warehouseTypes";

import {
  ADD_UPDATE_ITEM,
  ADD_UPDATE_ITEM_CATEGORY,
  REMOVE_CATEGORY,
  REMOVE_ITEM,
  ADD_UPDATE_BUSINESS_PARTNER,
  REMOVE_BUSINESS_PARTNER,
  ADD_UPDATE_CLIENT,
  ADD_UPDATE_ORGANIZATION,
  ADD_UPDATE_WAREHOUSE,
  REMOVE_CLIENT,
  REMOVE_ORGANIZATION,
  REMOVE_WAREHOUSE,
  ADD_USER_ROLES,
  ADD_USER_WAREHOUSES,
  CREATE_USER,
} from "../../apollo/mutations";
import {
  GET_ALL_CATEGORIES,
  GET_ALL_ITEMS,
  GET_SELECTED_ITEM,
  GET_ALL_BUSINESS_PARTNERS,
  GET_SELECTED_BUSINESS_PARTNER,
  GET_ALL_CLIENTS,
  GET_ALL_ORGANIZATIONS,
  GET_ALL_WAREHOUSES,
  GET_SELECTED_CLIENT,
  GET_SELECTED_ORGANIZATION,
  GET_SELECTED_WAREHOUSE,
  GET_ALL_ROLES,
  GET_ALL_USERS,
  GET_SELECTED_USER,
} from "../../apollo/queries";

import {
  RejectWithValueType,
  AuthUser,
  Role,
  CreateUser,
} from "../auth/types/authType";

export const fetchItems = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("setups/fetchItems", async (_arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    //await sleep(5000);
    const response = await apolloClient.query({
      query: GET_ALL_ITEMS,
    });

    if (response && response.data && response.data.items) {
      return response.data.items as Item[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const fetchCategories = createAsyncThunk<
  any,
  CategoryType,
  { rejectValue: RejectWithValueType }
>("setups/fetchCategories", async (categoryType, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

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
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const getItem = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/getItem", async (_id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_ITEM,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getItem) {
      return response.data.getItem as Item;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
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
    const message = error.message;
    dispatch(setSelectedItem(arg));
    await setErrorAction(dispatch, { message });
    //error.graphQLErrors[0].extensions.exception.response.status;
    return rejectWithValue({ message });
  }
});

export const addCategory = createAsyncThunk<
  any,
  Category,
  { rejectValue: RejectWithValueType }
>("setups/addCategory", async (category, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
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
      if (category.type === CategoryType.ItemCategory) {
        const addedCategory = (await response.data
          .createItemCategory) as Category;
        return { type: category.type, data: addedCategory };
      } else {
        const addedUom = (await response.data.createItemCategory) as Category;

        return { type: category.type, data: addedUom };
      }
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const removeItem = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/removeItem", async (id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_ITEM,
      variables: { id },
      refetchQueries: [{ query: GET_ALL_ITEMS }],
    });

    if (response && response.data && response.data.removeItem) {
      await setSuccessAction(dispatch, {
        message: "Item Successfully Removed",
        setupType: "Item",
      });
      return id as number;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const removeCategory = createAsyncThunk<
  any,
  RemoveCategory,
  { rejectValue: RejectWithValueType }
>("setups/removeCategory", async (category, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
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
      return category as RemoveCategory;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const fetchBusinessPartners = createAsyncThunk<
  any,
  BusinessPartnerType,
  { rejectValue: RejectWithValueType }
>("setups/fetchBusinessPartners", async (type, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_BUSINESS_PARTNERS,
      variables: { type },
    });

    if (response && response.data && response.data.businessPartners) {
      return response.data.businessPartners as BusinessPartner[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
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
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
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
    const message = error.message;
    dispatch(setSelectedBusinessPartner(arg));
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const removeBusinessPartner = createAsyncThunk<
  any,
  RemoveBusinessPartner,
  { rejectValue: RejectWithValueType }
>("setups/removeBusinessPartner", async ({ id, type }, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_BUSINESS_PARTNER,
      variables: { id },
      refetchQueries: [
        { query: GET_ALL_BUSINESS_PARTNERS, variables: { type } },
      ],
    });

    if (response && response.data && response.data.removeBusinessPartner) {
      await setSuccessAction(dispatch, {
        message: "BusinessPartner Successfully Removed",
        setupType: "BusinessPartner",
      });
      return id as number;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const fetchClients = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("setups/fetchClients", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_CLIENTS,
    });

    if (response && response.data && response.data.clients) {
      return response.data.clients as Client[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
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
    const message = error.message;
    await setErrorAction(dispatch, { message });

    return rejectWithValue({ message });
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
    const message = error.message;
    dispatch(setSelectedClient(arg));
    await setErrorAction(dispatch, { message });

    return rejectWithValue({ message });
  }
});

export const removeClient = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/removeClient", async (id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_CLIENT,
      variables: { id },
      refetchQueries: [{ query: GET_ALL_CLIENTS }],
    });

    if (response && response.data && response.data.removeClient) {
      await setSuccessAction(dispatch, {
        message: "Client Successfully Removed",
        setupType: "Client",
      });
      return id as number;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const fetchOrganizations = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/fetchOrganizations", async (clientId, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_ORGANIZATIONS,
      variables: { clientId },
    });

    if (response && response.data && response.data.organizations) {
      return response.data.organizations as Organization[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
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
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
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
    //console.log(org);
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
        parentId: org.clientId,
      });

      return addedOrganization;
    }
    // return businessPartner;
  } catch (error: any) {
    const message = error.message;
    dispatch(setSelectedOrganization(arg));
    await setErrorAction(dispatch, { message });

    return rejectWithValue({ message });
  }
});

export const removeOrganization = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/removeOrganization", async (id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_ORGANIZATION,
      variables: { id },
      refetchQueries: [{ query: GET_ALL_ORGANIZATIONS }],
    });

    if (response && response.data && response.data.removeOrganization) {
      await setSuccessAction(dispatch, {
        message: "Organization Successfully Removed",
        setupType: "Organization",
      });
      return id as number;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const fetchWarehouses = createAsyncThunk<
  any,
  FetchWarehousesOptions,
  { rejectValue: RejectWithValueType }
>("setups/fetchWarehouses", async (fetchWarehousesOptions, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_WAREHOUSES,
      variables: { ...fetchWarehousesOptions },
    });

    if (response && response.data && response.data.warehouses) {
      return response.data.warehouses as Warehouse[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
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
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const addWarehouse = createAsyncThunk<
  any,
  Warehouse,
  { rejectValue: RejectWithValueType }
>("setups/addWarehouse", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    let ware = { ...arg };
    const { address } = ware;
    //console.log(ware);
    const response = await apolloClient.mutate({
      mutation: ADD_UPDATE_WAREHOUSE,
      variables: {
        id: ware.id,
        organizationId: ware.organizationId,
        displayName: ware.displayName,
        addressId: address?.id,
        mobile: address?.mobile,
        telephone: address?.telephone,
        email: address?.email,
      },
      refetchQueries: [
        {
          query: GET_ALL_WAREHOUSES,
          variables: { organizationId: ware.organizationId },
        },
      ],
    });

    if (response && response.data && response.data.createUpdateWarehouse) {
      const addedWarehouse = (await response.data
        .createUpdateWarehouse) as Warehouse;

      await setSuccessAction(dispatch, {
        message: "Warehouse Successfully Saved",
        setupType: "Warehouse",
        parentId: ware.organizationId,
      });

      return addedWarehouse;
    }
    // return businessPartner;
  } catch (error: any) {
    const message = error.message;
    dispatch(setSelectedWarehouse(arg));
    await setErrorAction(dispatch, { message });

    return rejectWithValue({ message });
  }
});

export const removeWarehouse = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/removeWarehouse", async (id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_WAREHOUSE,
      variables: { id },
      refetchQueries: [{ query: GET_ALL_WAREHOUSES }],
    });

    if (response && response.data && response.data.removeWarehouse) {
      await setSuccessAction(dispatch, {
        message: "Warehouse Successfully Removed",
        setupType: "Warehouse",
      });
      return id as number;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const fetchUsers = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("users/fetchUsers", async (_arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_USERS,
    });

    if (response && response.data && response.data.Users) {
      return response.data.Users as AuthUser[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const getUser = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("users/getUser", async (userId, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_USER,
      variables: { id: userId },
    });
    if (response && response.data && response.data.GetUser) {
      return response.data.GetUser as AuthUser;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const createUser = createAsyncThunk<
  any,
  CreateUser,
  { rejectValue: RejectWithValueType }
>("users/createUser", async (user, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

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
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const addUserRoles = createAsyncThunk<
  any,
  number[],
  { rejectValue: RejectWithValueType }
>("users/addUserRoles", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

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
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const addUserWarehouses = createAsyncThunk<
  any,
  number[],
  { rejectValue: RejectWithValueType }
>("users/addUserWarehouses", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
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
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});
export const fetchRoles = createAsyncThunk<
  any,
  string,
  { rejectValue: RejectWithValueType }
>("users/fetchRoles", async (_arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_ROLES,
    });

    if (response && response.data && response.data.GetRoles) {
      return response.data.GetRoles as Role[];
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
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
        dispatch(
          resetSelectedOrganization({
            ...defaultOrganization,
            clientId: payload.parentId,
          })
        );
        break;
      case "Warehouse":
        dispatch(
          resetSelectedWarehouse({
            ...defaultWarehouse,
            organizationId: payload.parentId,
          })
        );
        break;
      case "User":
        dispatch(
          resetSelectedUser({
            ...defaultUser,
          })
        );
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
  clientId: 0,
  description: "",
  address: { mobile: "", telephone: "", email: "" },
};
const defaultWarehouse: Warehouse = {
  displayName: "",
  organizationId: 0,
  description: "",
  address: { mobile: "", telephone: "", email: "" },
};
const defaultUser: AuthUser = {
  email: "",
  name: "",
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
  users: [],
  roles: [],
  selectedUser: { ...defaultUser },
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
    resetSelectedOrganization: (state, { payload }) => {
      state.selectedOrganization = payload;
    },
    setSelectedWarehouse: (state, { payload }) => {
      state.selectedWarehouse = payload;
    },
    setWarehouses: (state, { payload }) => {
      state.warehouses = payload;
    },
    resetSelectedWarehouse: (state, { payload }) => {
      state.selectedWarehouse = payload;
    },
    setSelectedUser: (state, { payload }) => {
      state.selectedUser = payload;
    },
    setUsers: (state, { payload }) => {
      state.users = payload;
    },
    resetSelectedUser: (state, { payload }) => {
      state.selectedUser = payload;
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
    builder.addCase(fetchItems.rejected, (state) => {
      state.loading = "idle";
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
    builder.addCase(getItem.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addItem.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addItem.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedItem = payload;
      state.items = state.items.filter((c) => c.id !== payload.id);
      state.items.unshift(payload);
    });
    builder.addCase(addItem.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeItem.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeItem.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.items = state.items.filter((c) => c.id !== payload);
    });
    builder.addCase(removeItem.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addCategory.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addCategory.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      if (payload.type === CategoryType.ItemCategory) {
        state.categories = state.categories.filter((c) => c.id !== payload.id);
        state.categories.unshift(payload);
      } else {
        state.uoms = state.uoms.filter((c) => c.id !== payload.id);
        state.uoms.unshift(payload);
      }
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
      if (payload.type === CategoryType.ItemCategory) {
        state.categories = state.categories.filter((c) => c.id !== payload.id);
      } else {
        state.uoms = state.uoms.filter((c) => c.id !== payload.id);
      }
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
    builder.addCase(fetchBusinessPartners.rejected, (state) => {
      state.loading = "idle";
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
      state.businessPartners = state.businessPartners.filter(
        (c) => c.id !== payload.id
      );
      state.businessPartners.unshift(payload);
    });
    builder.addCase(addBusinessPartner.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeBusinessPartner.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeBusinessPartner.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.businessPartners = state.businessPartners.filter(
        (c) => c.id !== payload
      );
    });
    builder.addCase(removeBusinessPartner.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(fetchClients.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchClients.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.clients = payload;
    });
    builder.addCase(fetchClients.rejected, (state) => {
      state.loading = "idle";
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
      state.clients = state.clients.filter((c) => c.id !== payload);
    });
    builder.addCase(removeClient.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(fetchOrganizations.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchOrganizations.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.organizations = payload;
    });
    builder.addCase(fetchOrganizations.rejected, (state) => {
      state.loading = "idle";
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
      state.organizations = state.organizations.filter(
        (c) => c.id !== payload.id
      );
      state.organizations.unshift(payload);
    });
    builder.addCase(addOrganization.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeOrganization.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeOrganization.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.organizations = state.organizations.filter((c) => c.id !== payload);
    });
    builder.addCase(removeOrganization.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(fetchWarehouses.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchWarehouses.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.warehouses = payload;
      // state.warehouses = [...payload, { displayName: "Warehouse", id: 0 }];
    });
    builder.addCase(fetchWarehouses.rejected, (state) => {
      state.loading = "idle";
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
      state.warehouses = state.warehouses.filter((c) => c.id !== payload.id);
      state.warehouses.unshift(payload);
    });
    builder.addCase(addWarehouse.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeWarehouse.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeWarehouse.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.warehouses = state.warehouses.filter((c) => c.id !== payload);
    });
    builder.addCase(removeWarehouse.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.users = payload;
    });
    builder.addCase(fetchUsers.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(getUser.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedUser = payload;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(createUser.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(createUser.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedUser = payload;
    });
    builder.addCase(createUser.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(fetchRoles.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchRoles.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.roles = payload;
    });
    builder.addCase(fetchRoles.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addUserRoles.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addUserRoles.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedUser = payload;
    });
    builder.addCase(addUserRoles.rejected, (state) => {
      state.loading = "idle";
    });
    builder.addCase(addUserWarehouses.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addUserWarehouses.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedUser = payload;
    });
    builder.addCase(addUserWarehouses.rejected, (state) => {
      state.loading = "idle";
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
  setUsers,
  setSelectedUser,
  resetSelectedUser,
} = actions;

export default reducer;

// Selectors
export const selectSetups = (state: RootState) => state.setups as SetupsState;
