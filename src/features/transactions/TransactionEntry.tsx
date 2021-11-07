import { useEffect, useRef, useState } from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
//import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import DateTimePicker from "@mui/lab/DateTimePicker";

import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";
import { NavLink as RouterLink } from "react-router-dom";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Toast from "../../components/Layout/Toast";

import {
  fetchLines,
  selectTransactions,
  setSelectedLine,
  resetLines,
  setSelectedHeader,
  addLine,
  removeLine,
  postHeader,
  unPostHeader,
  fetchInventories,
  addHeader,
  getHeader,
} from "./transactionsSlice";
import {
  TransactionLine,
  TransactionHeader,
  HeaderProps,
  TransactionStatus,
  TransactionType,
  Inventory,
} from "./types/transactionTypes";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import { changePageTitle } from "../preferences/preferencesSlice";
import { Add, Backspace, Delete, Edit } from "@mui/icons-material";
import {
  Grid,
  TextField,
  Divider,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableBody,
  Stack,
  IconButton,
  Autocomplete,
  LinearProgress,
} from "@mui/material";
import Save from "@mui/icons-material/Save";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import { Item } from "../setups/types/itemTypes";
import { lineSchema } from "./validation";
import { selectAuth } from "../auth/authSlice";
import { isPrivilegedTransaction } from "../../utils/authUtils";
import { Role } from "../auth/types/authType";
import {
  fetchBusinessPartners,
  fetchItems,
  fetchWarehouses,
  selectSetups,
} from "../setups/setupSlices";
import { BusinessPartner, BusinessPartnerType } from "../setups/types/bpTypes";
import { Warehouse } from "../setups/types/warehouseTypes";
import CustomDialog from "../../components/modals/CustomDialog";
import Post from "../../components/transaction/Post";

export const TransactionEntry = ({ type }: HeaderProps) => {
  const { id } = useParams() as {
    id: string;
  };

  const bpType =
    type === TransactionType.Sale
      ? BusinessPartnerType.Customer
      : BusinessPartnerType.Vendor;
  const [open, setOpen] = useState(false);
  //const opn = useRef(false);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [selectedInventory, setSelectedInventory] = useState<Inventory>({
    qtyOnHand: 0,
  });
  const [tranHeader, setTranHeader] = useState<TransactionHeader>({
    type,
    businessPartner: { displayName: `select ${bpType}`, id: 0 },
    warehouse: {
      displayName: type === TransactionType.Transfer ? `Origin` : `Warehouse`,
      id: 0,
    },
    toWarehouse: { displayName: "Destination", id: 0 },
  });
  const [tranLine, setTranLine] = useState<TransactionLine>({});
  const dispatch = useAppDispatch();
  const [leftItems, setLeftItems] = useState<Item[]>([]);
  const { items, businessPartners, warehouses } = useAppSelector(selectSetups);
  const { user } = useAppSelector(selectAuth);

  const {
    lines,
    selectedHeader,
    selectedLine,
    inventories,
    loading,
    success,
    error,
  } = useAppSelector(selectTransactions);

  useEffect(() => {
    dispatch(changePageTitle(`${type} Entry`));
    dispatch(fetchInventories("all"));
    dispatch(fetchBusinessPartners(bpType));
    dispatch(fetchWarehouses({ parent: "Organization", parentId: 2 }));
    dispatch(fetchItems("all"));
    if (id && id !== "0") {
      dispatch(getHeader(parseInt(id)));
    } else {
      resetFields();
    }
  }, [dispatch, type, id]);

  useEffect(() => {
    setTranHeader(selectedHeader);
    let ln: TransactionLine = {
      header: selectedHeader,
      item: { displayName: "select item", id: 0 },
      qty: 0,
      eachPrice: 0,
    };
    dispatch(setSelectedLine(ln));
    dispatch(fetchLines({ headerId: parseInt(id) }));
  }, [dispatch, id, selectedHeader, businessPartners, warehouses]);

  useEffect(() => {
    setLeftItems(items.filter((i) => !lines.some((l) => l.item?.id === i.id)));
  }, [lines, items]);

  useEffect(() => {
    setTranLine(selectedLine);
  }, [selectedLine]);

  useEffect(() => {
    if (selectedItemId !== 0) {
      const inv = inventories.find((i) => i.item?.id === selectedItemId);
      if (inv) setSelectedInventory(inv as Inventory);
      else setSelectedInventory({ qtyOnHand: 0 });
    }
  }, [selectedItemId]);

  function resetFields() {
    dispatch(resetLines());
    const hd: TransactionHeader = {
      type,
      transactionDate: new Date(),
      status: TransactionStatus.Draft,
      businessPartner: { displayName: `select ${bpType}`, id: 0 },
      warehouse: {
        displayName: type === TransactionType.Transfer ? `Origin` : `Warehouse`,
        id: 0,
      },
      toWarehouse: { displayName: "Destination", id: 0 },
    };
    dispatch(setSelectedHeader(hd));
    // let ln: TransactionLine = {
    //   header: hd,
    //   item: { displayName: "select item", id: 0 },
    //   qty: 0,
    //   eachPrice: 0,
    // };
    // dispatch(setSelectedLine(ln));
  }

  const DeleteLine = (id: number) => {
    dispatch(removeLine(id));
  };
  const SetSelectedLine = (id: number) => {
    // setLeftItems(leftItems.concat(lines.filter((l) => l.item.id === id)));
    dispatch(
      setSelectedLine(lines.find((cat) => cat.id === id) as TransactionLine)
    );
  };
  const postTransactionHandler = () => {
    setOpen(true);
    //opn.current = true;
  };
  const dialogClose = () => {
    setOpen(false);
    //opn.current = false;
  };

  function postTransaction() {
    //dispatch(postHeader(selectedHeader.id as number));
    postTransactionHandler();
    //opn.current = true;
    //console.log(opn.current);
  }
  function unPostTransaction() {
    dispatch(unPostHeader(selectedHeader.id as number));
  }
  return (
    <>
      <Helmet>
        <title>{type} Entry | Pinna Stock</title>
      </Helmet>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={`/app/${type}`}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Backspace />
          </Typography>
        </Button>
        <Stack direction="row" spacing={2}>
          {isPrivilegedTransaction(user?.roles as Role[], type, "Add") && (
            <Button color="secondary" variant="contained" onClick={resetFields}>
              <Typography
                variant="h5"
                component="h5"
                sx={{ display: "flex", justifyItems: "center" }}
              >
                <Add />
              </Typography>
            </Button>
          )}
          {selectedHeader?.status === TransactionStatus.Draft &&
            isPrivilegedTransaction(user?.roles as Role[], type, "Post") && (
              <Button
                // sx={{ display: { xs: "none", sm: "block" } }}
                color="secondary"
                variant="contained"
                onClick={postTransaction}
              >
                <Typography
                  variant="h5"
                  component="h5"
                  sx={{ display: "flex", justifyItems: "center" }}
                >
                  POST
                </Typography>
              </Button>
            )}
          {selectedHeader?.status === TransactionStatus.Posted &&
            isPrivilegedTransaction(user?.roles as Role[], type, "UnPost") && (
              <Button
                color="secondary"
                variant="contained"
                onClick={resetFields}
              >
                <Typography
                  variant="h5"
                  component="h5"
                  sx={{ display: "flex", justifyItems: "center" }}
                  onClick={unPostTransaction}
                >
                  UnPost
                </Typography>
              </Button>
            )}
        </Stack>
      </Box>
      <Divider variant="middle" sx={{ my: 2 }} />

      <Box>
        {success && <Toast severity="success">{success.message}</Toast>}
        {error && <Toast severity="error">{error.message}</Toast>}

        <Container maxWidth="lg">
          {selectedHeader?.status === TransactionStatus.Draft &&
            isPrivilegedTransaction(user?.roles as Role[], type, "Add") && (
              <>
                <Accordion sx={{ my: 1 }} expanded={true}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{type} Detail</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Formik
                      enableReinitialize={true}
                      initialValues={tranHeader as TransactionHeader}
                      onSubmit={(values, actions) => {
                        actions.setSubmitting(false);
                        dispatch(addHeader(values));
                      }}
                    >
                      {(props: FormikProps<TransactionHeader>) => (
                        <Form>
                          <Grid container spacing={1} alignItems="center">
                            <Grid item md={4} xs={12}>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DateTimePicker
                                  label={type + " Date"}
                                  inputFormat="MMM-dd-yyyy"
                                  minDate={new Date("2021-01-01")}
                                  value={props.values.transactionDate}
                                  onChange={(value) => {
                                    setTranHeader({
                                      ...tranHeader,
                                      transactionDate: value as Date,
                                    });
                                    props.setFieldValue(
                                      "transactionDate",
                                      value
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      helperText=""
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </Grid>

                            <Grid item md={3} xs={12}>
                              <Autocomplete
                                id="warehouseId"
                                options={warehouses}
                                value={props.values?.warehouse}
                                getOptionLabel={(option) =>
                                  option.displayName as string
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
                                onChange={(e, value) => {
                                  setTranHeader({
                                    ...tranHeader,
                                    warehouse: value as Warehouse,
                                  });
                                  props.setFieldValue(
                                    "warehouse",
                                    value !== null ? value : null
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    label={
                                      type === TransactionType.Transfer
                                        ? "Origin"
                                        : "Warehouse"
                                    }
                                    name="warehouseId"
                                    {...params}
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item md={3} xs={12}>
                              {type !== TransactionType.PI && (
                                <>
                                  {type === TransactionType.Transfer ? (
                                    <Autocomplete
                                      id="toWarehouseId"
                                      options={warehouses}
                                      value={props.values?.toWarehouse}
                                      getOptionLabel={(option) =>
                                        option.displayName as string
                                      }
                                      isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                      }
                                      onChange={(e, value) => {
                                        setTranHeader({
                                          ...tranHeader,
                                          toWarehouse: value as Warehouse,
                                        });
                                        props.setFieldValue(
                                          "toWarehouse",
                                          value !== null ? value : null
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          label="Destination"
                                          name="toWarehouseId"
                                          {...params}
                                        />
                                      )}
                                    />
                                  ) : (
                                    <Autocomplete
                                      id="businessPartnerId"
                                      options={businessPartners}
                                      value={props.values?.businessPartner}
                                      getOptionLabel={(option) =>
                                        option.displayName as string
                                      }
                                      isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                      }
                                      onChange={(e, value) => {
                                        setTranHeader({
                                          ...tranHeader,
                                          businessPartner:
                                            value as BusinessPartner,
                                        });
                                        props.setFieldValue(
                                          "businessPartner",
                                          value !== null ? value : null
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          label={bpType}
                                          name="businessPartnerId"
                                          {...params}
                                        />
                                      )}
                                    />
                                  )}
                                </>
                              )}
                            </Grid>
                            <Grid item md={2} xs={12}>
                              <Button
                                sx={{ width: "100%", p: 1.5 }}
                                type="submit"
                                color="secondary"
                                variant="contained"
                                disabled={!props.isValid}
                              >
                                <Save /> Save
                              </Button>
                            </Grid>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  </AccordionDetails>
                </Accordion>

                <Box sx={{ mb: 3 }}>
                  <>
                    <Formik
                      enableReinitialize={true}
                      validationSchema={lineSchema}
                      initialValues={tranLine as TransactionLine}
                      onSubmit={(values, actions) => {
                        actions.setSubmitting(false);
                        if (type === TransactionType.PI) {
                          values = {
                            ...values,
                            diff:
                              (values.qty as number) -
                              (selectedInventory?.qtyOnHand as number),
                          };
                        }
                        values = {
                          ...values,
                          header: { ...tranHeader, type },
                        };
                        dispatch(addLine(values));
                      }}
                    >
                      {(props: FormikProps<TransactionLine>) => (
                        <Form>
                          <Grid container spacing={1} alignItems="center">
                            <Grid item md={4} xs={12}>
                              <Autocomplete
                                id="itemId"
                                options={leftItems}
                                value={props.values?.item}
                                getOptionLabel={(option) =>
                                  option.displayName as string
                                }
                                sx={{ mt: 1 }}
                                onChange={(e, value) => {
                                  props.setFieldValue(
                                    "item",
                                    value !== null ? value : null
                                  );
                                  props.setFieldValue(
                                    "eachPrice",
                                    value !== null
                                      ? type === TransactionType.Purchase
                                        ? value.purchasePrice
                                        : value.sellingPrice
                                      : null
                                  );
                                  setSelectedItemId(value?.id as number);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    label="Items"
                                    name="itemId"
                                    {...params}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item md={2} xs={12}>
                              <TextField
                                id="outlined-basic"
                                label="OnHand"
                                value={
                                  selectedInventory
                                    ? selectedInventory.qtyOnHand
                                    : 0
                                }
                                variant="outlined"
                                fullWidth
                                disabled
                                sx={{ mt: 1 }}
                              />
                            </Grid>
                            <Grid item md={2} xs={12}>
                              <FormikTextField
                                formikKey="qty"
                                label="Qty."
                                type={"number"}
                              />
                            </Grid>
                            <Grid item md={2} xs={12}>
                              <FormikTextField
                                formikKey="eachPrice"
                                label="Each Price"
                                type={"number"}
                              />
                            </Grid>

                            <Grid item md={2} xs={12}>
                              <Button
                                sx={{ width: "100%", mt: 1, p: 1.5 }}
                                type="submit"
                                color="secondary"
                                variant="contained"
                                disabled={!props.isValid}
                              >
                                <Save /> Add
                              </Button>
                            </Grid>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  </>
                </Box>
              </>
            )}
          <Box sx={{ my: 1 }}>
            {loading === "pending" && (
              <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
                <LinearProgress color="secondary" />
                <LinearProgress color="inherit" />
                <LinearProgress color="primary" />
              </Stack>
            )}
          </Box>
          <TableContainer component={Paper} sx={{ mt: "8px" }}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Item Name</StyledTableCell>
                  <StyledTableCell align="right">Qty</StyledTableCell>
                  {type === TransactionType.PI && (
                    <StyledTableCell align="right">Difference</StyledTableCell>
                  )}
                  <StyledTableCell align="right">Each Price</StyledTableCell>
                  <StyledTableCell align="right">Total Price</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {lines &&
                  lines.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell scope="row" sx={{ padding: "0px 16px" }}>
                        {row.item?.displayName}
                      </StyledTableCell>
                      <StyledTableCell
                        scope="row"
                        sx={{ padding: "0px 16px" }}
                        align="right"
                      >
                        {row.qty?.toLocaleString()}
                      </StyledTableCell>

                      {type === TransactionType.PI && (
                        <StyledTableCell
                          scope="row"
                          sx={{ padding: "0px 16px" }}
                          align="right"
                        >
                          {row.diff?.toLocaleString()}
                        </StyledTableCell>
                      )}

                      <StyledTableCell
                        scope="row"
                        sx={{ padding: "0px 16px" }}
                        align="right"
                      >
                        {row.eachPrice?.toLocaleString()}
                      </StyledTableCell>

                      <StyledTableCell
                        scope="row"
                        sx={{ padding: "0px 16px" }}
                        align="right"
                      >
                        {row.linePrice?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "0px 16px" }}>
                        {selectedHeader?.status === TransactionStatus.Draft &&
                          isPrivilegedTransaction(
                            user?.roles as Role[],
                            type,
                            "Add"
                          ) && (
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  SetSelectedLine(row ? (row.id as number) : 0)
                                }
                                size="large"
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                color="secondary"
                                onClick={() =>
                                  DeleteLine(row ? (row.id as number) : 0)
                                }
                                size="large"
                              >
                                <Delete />
                              </IconButton>
                            </Stack>
                          )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                <StyledTableRow>
                  <StyledTableCell
                    sx={{ fontWeight: "900" }}
                    scope="row"
                    align="left"
                  >
                    {selectedHeader?.numberOfItems} Items
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ fontWeight: "900" }}
                    scope="row"
                    align="right"
                  >
                    Total Qty: {selectedHeader?.totalQty}
                  </StyledTableCell>
                  <StyledTableCell></StyledTableCell>

                  <StyledTableCell
                    sx={{ fontWeight: "900", fontSize: "24px" }}
                    scope="row"
                    align="right"
                  >
                    Total Amount : {selectedHeader?.totalAmount}
                  </StyledTableCell>

                  <StyledTableCell></StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      <CustomDialog title="Post" isOpen={open} handleDialogClose={dialogClose}>
        <Post id={selectedHeader.id as number} />
      </CustomDialog>
    </>
  );
};
