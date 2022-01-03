import {
  createAsyncThunk,
  createSelector,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { apolloClient } from "../../apollo/graphql";
import {
  Category,
  CategoryArgs,
  CategoryType,
  FinancialAccountArgs,
  Item,
  ItemArgs,
  ItemsWithCount,
  RemoveCategory,
} from "./types/itemTypes";
import {
  FinancialAccount,
  FinancialAccountsWithCount,
} from "../transactions/types/paymentTypes";
import {
  BusinessPartnerType,
  BusinessPartner,
  SetupsState,
  RemoveBusinessPartner,
  BusinessPartnerArgs,
  BusinessPartnersWithCount,
} from "./types/bpTypes";
import { Client, Organization, Warehouse } from "./types/warehouseTypes";

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
  ADD_UPDATE_FINANCIAL_ACCOUNT,
  REMOVE_FINANCIAL_ACCOUNT,
} from "../../apollo/mutations";
import {
  GET_CATEGORIES,
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
  GET_SELECTED_FINANCIAL_ACCOUNT,
  GET_ITEMS,
  GET_FINANCIAL_ACCOUNTS,
} from "../../apollo/queries";

import {
  GET_ALL_CATEGORIES,
  GET_ALL_ITEMS,
  GET_ALL_FINANCIAL_ACCOUNTS,
} from "../../apollo/queries";
import {
  RejectWithValueType,
  AuthUser,
  Role,
  CreateUser,
} from "../auth/types/authType";
import {
  ClientArgs,
  OrganizationArgs,
  UserArgs,
  WarehouseArgs,
} from "./types/setupTypes";

export const fetchItems = createAsyncThunk<
  any,
  ItemArgs,
  { rejectValue: RejectWithValueType }
>("setups/fetchItems", async (itemArg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const { refreshList } = itemArg;

  try {
    const fetchPolicy =
      refreshList === "refresh" ? "network-only" : "cache-first";

    //await sleep(5000);
    const response = await apolloClient.query({
      query: GET_ITEMS,
      variables: {
        ...itemArg,
      },
      fetchPolicy,
    });

    if (response && response.data && response.data.items) {
      return response.data.items as ItemsWithCount;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const fetchFinancialAccounts = createAsyncThunk<
  any,
  FinancialAccountArgs,
  { rejectValue: RejectWithValueType }
>("setups/fetchFinancialAccounts", async (faArg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const { refreshList } = faArg;
  try {
    const fetchPolicy =
      refreshList === "refresh" ? "network-only" : "cache-first";

    //await sleep(5000);
    const response = await apolloClient.query({
      query: GET_FINANCIAL_ACCOUNTS,
      variables: {
        ...faArg,
      },
      fetchPolicy,
    });

    if (response && response.data && response.data.financialAccounts) {
      return response.data.financialAccounts as FinancialAccountsWithCount;
    }
  } catch (error: any) {
    const message = error.message;
    await setErrorAction(dispatch, { message });
    return rejectWithValue({ message });
  }
});

export const fetchCategories = createAsyncThunk<
  any,
  CategoryArgs,
  { rejectValue: RejectWithValueType }
>("setups/fetchCategories", async (categoryArg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const fetchPolicy =
      categoryArg.refreshList === "refresh" ? "network-only" : "cache-first";

    const response = await apolloClient.query({
      query: GET_CATEGORIES,
      variables: { ...categoryArg },
      fetchPolicy,
    });

    if (response && response.data && response.data.getCategories) {
      return response.data.getCategories as Category[];
      // return {
      //   type: categoryArg.type,
      //   data: response.data.getCategories as Category[],
      // };
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
export const getFinancialAccount = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/getFinancialAccount", async (_id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_FINANCIAL_ACCOUNT,
      variables: { id: _id },
    });

    if (response && response.data && response.data.getFinancialAccount) {
      return response.data.getFinancialAccount as FinancialAccount;
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
>("setups/addItem", async (item, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: ADD_UPDATE_ITEM,
      variables: {
        ...item,
        itemCategoryId: item.itemCategory?.id,
        unitOfMeasureId: item.unitOfMeasure?.id,
      },
      refetchQueries: [{ query: GET_ITEMS }, { query: GET_ALL_ITEMS }],
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
    dispatch(setSelectedItem(item));
    await setErrorAction(dispatch, { message });
    //error.graphQLErrors[0].extensions.exception.response.status;
    return rejectWithValue({ message });
  }
});

export const addFinancialAccount = createAsyncThunk<
  any,
  FinancialAccount,
  { rejectValue: RejectWithValueType }
>("setups/addFinancialAccount", async (fa, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: ADD_UPDATE_FINANCIAL_ACCOUNT,
      variables: {
        ...fa,
        bankId: fa.bank?.id,
      },
      refetchQueries: [{ query: GET_ALL_FINANCIAL_ACCOUNTS }],
    });

    if (response && response.data && response.data.createFinancialAccount) {
      const addedFinancialAccount = (await response.data
        .createFinancialAccount) as FinancialAccount;

      await setSuccessAction(dispatch, {
        message: "FinancialAccount Successfully Saved",
        setupType: "FinancialAccount",
      });

      return addedFinancialAccount;
    }
  } catch (error: any) {
    const message = error.message;
    dispatch(setSelectedFinancialAccount(fa));
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
        {
          query: GET_CATEGORIES,
          variables: { type: category.type },
        },
      ],
    });

    if (response && response.data && response.data.createItemCategory) {
      dispatch(setSelectedCategory({ ...category, id: 0, displayName: "" }));
      return (await response.data.createItemCategory) as Category;
      // if (category.type === CategoryType.ItemCategory) {
      //   const addedCategory = (await response.data
      //     .createItemCategory) as Category;
      //   return { type: category.type, data: addedCategory };
      // } else if (category.type === CategoryType.UnitOfMeasure) {
      //   const addedUom = (await response.data.createItemCategory) as Category;

      //   return { type: category.type, data: addedUom };
      // } else {
      //   const addedBank = (await response.data.createItemCategory) as Category;

      //   return { type: category.type, data: addedBank };
      // }
    }
  } catch (error: any) {
    const message = error.message;
    dispatch(setSelectedCategory(category));
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
      refetchQueries: [{ query: GET_ITEMS }, { query: GET_ALL_ITEMS }],
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

export const removeFinancialAccount = createAsyncThunk<
  any,
  number,
  { rejectValue: RejectWithValueType }
>("setups/removeFinancialAccount", async (id, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const response = await apolloClient.mutate({
      mutation: REMOVE_FINANCIAL_ACCOUNT,
      variables: { id },
      refetchQueries: [
        { query: GET_ALL_FINANCIAL_ACCOUNTS },
        { query: GET_FINANCIAL_ACCOUNTS },
      ],
    });

    if (response && response.data && response.data.removeFinancialAccount) {
      await setSuccessAction(dispatch, {
        message: "Financial Account Successfully Removed",
        setupType: "FinancialAccount",
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
        {
          query: GET_CATEGORIES,
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
  BusinessPartnerArgs,
  { rejectValue: RejectWithValueType }
>("setups/fetchBusinessPartners", async (businessPartnerArg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const { refreshList } = businessPartnerArg;
  try {
    const fetchPolicy =
      refreshList === "refresh" ? "network-only" : "cache-first";

    const response = await apolloClient.query({
      query: GET_ALL_BUSINESS_PARTNERS,
      variables: { ...businessPartnerArg },
      fetchPolicy,
    });

    if (response && response.data && response.data.businessPartners) {
      return response.data.businessPartners as BusinessPartnersWithCount;
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
  ClientArgs,
  { rejectValue: RejectWithValueType }
>("setups/fetchClients", async (clientArgs, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const { refreshList } = clientArgs;
    const fetchPolicy =
      refreshList === "refresh" ? "network-only" : "cache-first";
    const response = await apolloClient.query({
      query: GET_ALL_CLIENTS,
      variables: { ...clientArgs },
      fetchPolicy,
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
  OrganizationArgs,
  { rejectValue: RejectWithValueType }
>("setups/fetchOrganizations", async (organizationArgs, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const { refreshList } = organizationArgs;
    const fetchPolicy =
      refreshList === "refresh" ? "network-only" : "cache-first";
    const response = await apolloClient.query({
      query: GET_ALL_ORGANIZATIONS,
      variables: { ...organizationArgs },
      fetchPolicy,
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
  WarehouseArgs,
  { rejectValue: RejectWithValueType }
>("setups/fetchWarehouses", async (warehouseArgs, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const { refreshList } = warehouseArgs;
    const fetchPolicy =
      refreshList === "refresh" ? "network-only" : "cache-first";
    const response = await apolloClient.query({
      query: GET_ALL_WAREHOUSES,
      variables: { ...warehouseArgs },
      fetchPolicy,
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
  UserArgs,
  { rejectValue: RejectWithValueType }
>("users/fetchUsers", async (userArgs, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const { refreshList } = userArgs;
    const fetchPolicy =
      refreshList === "refresh" ? "network-only" : "cache-first";
    const response = await apolloClient.query({
      query: GET_ALL_USERS,
      variables: { ...userArgs },
      fetchPolicy,
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
      case "FinancialAccount":
        dispatch(resetSelectedFinancialAccount());
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
  itemCategory: { id: 0, displayName: "select..." },
  unitOfMeasure: { id: 0, displayName: "select..." },
  purchasePrice: 0,
  sellingPrice: 0,
  safeQty: 0,
};
const defaultFinancialAccount: FinancialAccount = {
  branch: "",
  accountNumber: "",
  bank: { id: 0, displayName: "select..." },
};
const defaultCategory: Category = {
  displayName: "",
  id: 0,
  type: CategoryType.ItemCategory,
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
  categories: [],
  // categoriesWithCount: { totalCount: 0, categories: [] },
  // uomsWithCount: { totalCount: 0, uoms: [] },
  // banksWithCount: { totalCount: 0, banks: [] },
  financialAccountsWithCount: { totalCount: 0, financialAccounts: [] },
  selectedCategory: { ...defaultCategory },
  itemsWithCount: { totalCount: 0, items: [] },
  selectedItem: { ...defaultItem },
  selectedFinancialAccount: { ...defaultFinancialAccount },
  businessPartnersWithCount: { totalCount: 0, businessPartners: [] },
  selectedBusinessPartner: { ...defaultBusinessPartner },
  clients: [],
  selectedClient: { ...defaultClient },
  organizations: [],
  selectedOrganization: { ...defaultOrganization },
  warehouses: [],
  selectedWarehouse: { ...defaultWarehouse },
  users: [],
  selectedUser: { ...defaultUser },
  roles: [],
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
    resetSelectedCategory: (state) => {
      state.selectedCategory = { ...defaultCategory };
    },
    setSelectedCategory: (state, { payload }) => {
      state.selectedCategory = payload;
    },
    resetSelectedItem: (state) => {
      state.selectedItem = { ...defaultItem };
    },
    setSelectedItem: (state, { payload }) => {
      state.selectedItem = payload;
    },

    setItems: (state, { payload }) => {
      state.itemsWithCount = payload;
    },

    resetSelectedFinancialAccount: (state) => {
      state.selectedFinancialAccount = { ...defaultFinancialAccount };
    },
    setSelectedFinancialAccount: (state, { payload }) => {
      state.selectedFinancialAccount = payload;
    },

    setFinancialAccounts: (state, { payload }) => {
      state.financialAccountsWithCount = payload;
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
      state.businessPartnersWithCount = payload;
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
      state.itemsWithCount = payload;
    });
    builder.addCase(fetchItems.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(fetchFinancialAccounts.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchFinancialAccounts.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.financialAccountsWithCount = payload;
    });
    builder.addCase(fetchFinancialAccounts.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchCategories.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.categories = payload;
      // if (payload.type === CategoryType.ItemCategory)
      //   state.categoriesWithCount = payload.data;
      // else if (payload.type === CategoryType.UnitOfMeasure)
      //   state.uomsWithCount = payload.data;
      // else state.banksWithCount = payload.data;
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

    builder.addCase(getFinancialAccount.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getFinancialAccount.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedFinancialAccount = payload;
    });
    builder.addCase(getFinancialAccount.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addItem.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addItem.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedItem = payload;

      state.itemsWithCount.totalCount =
        (state.itemsWithCount.totalCount as number) + 1;

      state.itemsWithCount.items = state.itemsWithCount.items?.filter(
        (h) => h.id !== payload.id
      );
      state.itemsWithCount.items.unshift(payload);
    });
    builder.addCase(addItem.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addFinancialAccount.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addFinancialAccount.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.selectedFinancialAccount = payload;
      state.financialAccountsWithCount.financialAccounts =
        state.financialAccountsWithCount.financialAccounts.filter(
          (c) => c.id !== payload.id
        );
      state.financialAccountsWithCount.financialAccounts.unshift(payload);
    });
    builder.addCase(addFinancialAccount.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeItem.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeItem.fulfilled, (state, { payload }) => {
      state.loading = "idle";

      state.itemsWithCount.totalCount =
        (state.itemsWithCount.totalCount as number) - 1;

      state.itemsWithCount.items = state.itemsWithCount.items?.filter(
        (h) => h.id !== payload.id
      );
    });
    builder.addCase(removeItem.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeFinancialAccount.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeFinancialAccount.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.financialAccountsWithCount.financialAccounts =
        state.financialAccountsWithCount.financialAccounts.filter(
          (c) => c.id !== payload
        );
    });
    builder.addCase(removeFinancialAccount.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(addCategory.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addCategory.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.categories = state.categories.filter((c) => c.id !== payload.id);
      state.categories.unshift(payload);
      // if (payload.type === CategoryType.ItemCategory) {
      //   state.categoriesWithCount.categories =
      //     state.categoriesWithCount.categories.filter(
      //       (c) => c.id !== payload.data.id
      //     );
      //   state.categoriesWithCount.categories.unshift(payload.data);
      // } else if (payload.type === CategoryType.UnitOfMeasure) {
      //   state.uomsWithCount.uoms = state.uomsWithCount.uoms.filter(
      //     (c) => c.id !== payload.data.id
      //   );
      //   state.uomsWithCount.uoms.unshift(payload.data);
      // } else {
      //   state.banksWithCount.banks = state.banksWithCount.banks.filter(
      //     (c) => c.id !== payload.data.id
      //   );
      //   state.banksWithCount.banks.unshift(payload.data);
      // }
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
      state.categories = state.categories.filter((c) => c.id !== payload.id);
      // if (payload.type === CategoryType.ItemCategory) {
      //   state.categoriesWithCount.categories =
      //     state.categoriesWithCount.categories.filter(
      //       (c) => c.id !== payload.id
      //     );
      // } else if (payload.type === CategoryType.UnitOfMeasure) {
      //   state.uomsWithCount.uoms = state.uomsWithCount.uoms.filter(
      //     (c) => c.id !== payload.id
      //   );
      // } else {
      //   state.banksWithCount.banks = state.banksWithCount.banks.filter(
      //     (c) => c.id !== payload.id
      //   );
      // }
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
      state.businessPartnersWithCount = payload;
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
      state.businessPartnersWithCount.businessPartners =
        state.businessPartnersWithCount.businessPartners.filter(
          (c) => c.id !== payload.id
        );
      state.businessPartnersWithCount.businessPartners.unshift(payload);
    });
    builder.addCase(addBusinessPartner.rejected, (state) => {
      state.loading = "idle";
    });

    builder.addCase(removeBusinessPartner.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(removeBusinessPartner.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.businessPartnersWithCount.businessPartners =
        state.businessPartnersWithCount.businessPartners.filter(
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
  resetSelectedFinancialAccount,
  setSelectedFinancialAccount,
  resetSelectedCategory,
  setSelectedCategory,
  setItems,
  setFinancialAccounts,
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

export const selectItemCategories = createSelector(selectSetups, (setups) =>
  setups.categories.filter(
    (cat: Category) => cat.type === CategoryType.ItemCategory
  )
);
export const selectItemCategoriesCount = createSelector(
  selectItemCategories,
  (cats) => cats.length
);

export const selectUoms = createSelector(selectSetups, (setups) =>
  setups.categories.filter(
    (uom: Category) => uom.type === CategoryType.UnitOfMeasure
  )
);
export const selectUomsCount = createSelector(
  selectUoms,
  (uoms) => uoms.length
);

export const selectBanks = createSelector(selectSetups, (setups) =>
  setups.categories.filter((bank: Category) => bank.type === CategoryType.Bank)
);
export const selectBanksCount = createSelector(
  selectBanks,
  (banks) => banks.length
);

// export const selectCategories = createSelector(
//   [(state) => state.categories, (state, category: Category) => category],
//   (categories, category) =>
//     categories.filter((cat: Category) => cat.type === category)
// );

// State selectors
// export const selectTodos = (state: RootState) => state.firestore.ordered.todos
// export const selectTodosCount = createSelector(selectTodos, (todos) => todos.length)
// export const selectActiveTodosCount = createSelector(
//   selectTodos,
//   (todos: Todo[]) => todos && todos.filter((todo) => !todo.isCompleted).length
// )

//State Selectors with Argument
// const selectItemsByCategory = createSelector(
//   [(state) => state.items, (state, category) => category],
//   (items, category) => items.filter((item) => item.category === category)
// );
