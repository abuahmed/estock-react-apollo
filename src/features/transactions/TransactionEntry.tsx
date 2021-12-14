import { useEffect, useState } from "react";
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
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import { StyledAccordionSummary2 } from "../../styles/componentStyled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Toast from "../../components/Layout/Toast";

import {
  selectTransactions,
  setSelectedLine,
  resetLines,
  resetPayments,
  setSelectedHeader,
  postHeader,
  unPostHeader,
  addHeader,
  getHeader,
  fetchPayments,
} from "./transactionsSlice";
import {
  TransactionLine,
  TransactionHeader,
  HeaderProps,
  TransactionStatus,
  TransactionType,
} from "./types/transactionTypes";

import {
  changePageTitle,
  // selectPreference,
} from "../preferences/preferencesSlice";
import { Add, Backspace, CancelScheduleSend, Send } from "@mui/icons-material";
import {
  Grid,
  TextField,
  Divider,
  Stack,
  Autocomplete,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import Save from "@mui/icons-material/Save";
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
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";
import { format } from "date-fns";
import { TransactionPayments } from "./TransactionPayments";
import { TransactionLines } from "./TransactionLines";

export const TransactionEntry = ({ type }: HeaderProps) => {
  const { id } = useParams() as {
    id: string;
  };

  const bpType =
    type === TransactionType.Sale
      ? BusinessPartnerType.Customer
      : BusinessPartnerType.Vendor;

  const [open, setOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("0");

  const [tranHeader, setTranHeader] = useState<TransactionHeader>({
    type,
    status: TransactionStatus.Draft,
    number: "",
    businessPartner: { displayName: `select ${bpType}`, id: 0 },
    warehouse: {
      displayName: type === TransactionType.Transfer ? `Origin` : `Warehouse`,
      id: 0,
    },
    toWarehouse: { displayName: "Destination", id: 0 },
  });

  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const {
    itemsWithCount: { items },
    businessPartnersWithCount: { businessPartners },
    warehouses,
  } = useAppSelector(selectSetups);

  const { selectedHeader, loading, success, error } =
    useAppSelector(selectTransactions);

  useEffect(() => {
    console.log(id);
    setTransactionId(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    dispatch(changePageTitle(`${type} Entry`));
    dispatch(fetchBusinessPartners({ type: bpType, skip: 0, take: -1 }));
    dispatch(fetchWarehouses({ parent: "Organization", parentId: 2 }));
    dispatch(fetchItems({ skip: 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, type]); //bpType

  useEffect(() => {
    if (
      items.length > 0 &&
      businessPartners.length > 0 &&
      warehouses.length > 0
    ) {
      if (transactionId && transactionId !== "0") {
        dispatch(getHeader(parseInt(transactionId)));
      } else {
        resetFields();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, transactionId, items, businessPartners, warehouses]);

  useEffect(() => {
    if (selectedHeader && selectedHeader.id) {
      if (selectedHeader.status === TransactionStatus.Posted) {
        setOpen(false);
        dispatch(fetchPayments({ headerId: parseInt(transactionId) }));
      }
    }
    if (selectedHeader.status === TransactionStatus.Draft) {
      setTranHeader(selectedHeader);
      let ln: TransactionLine = {
        header: selectedHeader,
        item: { displayName: "select item", id: 0 },
        qty: 0,
        eachPrice: 0,
      };
      dispatch(setSelectedLine(ln));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedHeader]);

  const resetFields = () => {
    dispatch(resetLines());
    dispatch(resetPayments());
    const hd: TransactionHeader = {
      type,
      transactionDate: new Date(),
      status: TransactionStatus.Draft,
      number: "",
      businessPartner: { ...businessPartners[0] },
      warehouse: {
        ...warehouses[0],
      },
    };
    if (type === TransactionType.Transfer)
      dispatch(setSelectedHeader({ ...hd, toWarehouse: { ...warehouses[0] } }));
    else dispatch(setSelectedHeader(hd));
  };

  const addNewTransaction = () => {
    setTransactionId("0");
  };

  const postTransactionHandler = () => {
    setOpen(true);
  };
  const dialogClose = () => {
    setOpen(false);
  };

  function postTransaction() {
    if (type === TransactionType.Sale || type === TransactionType.Purchase) {
      postTransactionHandler();
    } else {
      dispatch(postHeader(selectedHeader.id as number));
    }
  }
  function unPostTransaction() {
    dispatch(unPostHeader(selectedHeader.id as number));
  }

  return (
    <>
      <Helmet>
        <title>{type} Entry | Pinna Stock</title>
      </Helmet>
      <Stack
        direction="row"
        justifyContent="space-between"
        justifyItems="center"
      >
        <Tooltip title={`Return To ${type}s List`}>
          <Button
            color="secondary"
            variant="contained"
            component={RouterLink}
            to={`/app/${type}`}
          >
            <Backspace />
          </Button>
        </Tooltip>
        <Stack direction="row" spacing={2}>
          {isPrivilegedTransaction(user?.roles as Role[], type, "Add") && (
            <Tooltip title={`Add New ${type}`}>
              <Button
                color="secondary"
                variant="contained"
                onClick={addNewTransaction}
              >
                <Add />
              </Button>
            </Tooltip>
          )}
          {selectedHeader?.status === TransactionStatus.Draft &&
            isPrivilegedTransaction(user?.roles as Role[], type, "Post") && (
              <Tooltip title={`Post This ${type}`}>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={postTransaction}
                >
                  <Send />
                </Button>
              </Tooltip>
            )}
          {selectedHeader?.status === TransactionStatus.Posted &&
            isPrivilegedTransaction(user?.roles as Role[], type, "UnPost") && (
              <Tooltip title={`UnPost This ${type}`}>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={unPostTransaction}
                >
                  <CancelScheduleSend />
                </Button>
              </Tooltip>
            )}
        </Stack>
      </Stack>
      <Divider variant="middle" sx={{ my: 2 }} />

      <Box>
        {success && <Toast severity="success">{success.message}</Toast>}
        {error && <Toast severity="error">{error.message}</Toast>}

        <>
          <Accordion sx={{ my: 1 }} expanded={true}>
            <StyledAccordionSummary2
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6" color="primary">
                {type} Detail
              </Typography>
            </StyledAccordionSummary2>
            <AccordionDetails>
              {selectedHeader?.status === TransactionStatus.Draft &&
              isPrivilegedTransaction(user?.roles as Role[], type, "Add") ? (
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
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                                props.setFieldValue("transactionDate", value);
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
                                      businessPartner: value as BusinessPartner,
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
              ) : (
                <Grid container spacing={1} alignItems="center">
                  <Grid item md={4} xs={12}>
                    <TextField
                      id="outlined-basic"
                      label="Date"
                      value={`${format(
                        new Date(selectedHeader.transactionDate as Date),
                        "MMM-dd-yyyy"
                      )} (${getAmharicCalendarFormatted(
                        selectedHeader.transactionDate as Date,
                        "-"
                      )})`}
                      variant="outlined"
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <TextField
                      id="outlined-basic2"
                      label={
                        type === TransactionType.Transfer
                          ? "Origin"
                          : "Warehouse"
                      }
                      value={selectedHeader?.warehouse?.displayName}
                      variant="outlined"
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    {type !== TransactionType.PI && (
                      <>
                        {type === TransactionType.Transfer ? (
                          <TextField
                            id="outlined-basic4"
                            label="Destination"
                            value={selectedHeader?.toWarehouse?.displayName}
                            variant="outlined"
                            fullWidth
                            disabled
                          />
                        ) : (
                          <TextField
                            id="outlined-basic3"
                            label={bpType}
                            value={selectedHeader?.businessPartner?.displayName}
                            variant="outlined"
                            fullWidth
                            disabled
                          />
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Grid item md={4} xs={12}>
                  <TextField
                    id="outlined-number"
                    label="Number"
                    value={selectedHeader.number}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    id="outlined-status"
                    label="Status"
                    value={selectedHeader.status}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </>
        <Box sx={{ my: 1 }}>
          {loading === "pending" && (
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
              <LinearProgress color="secondary" />
              <LinearProgress color="inherit" />
              <LinearProgress color="primary" />
            </Stack>
          )}
        </Box>

        <TransactionLines
          type={type}
          tranHeader={tranHeader}
          headerId={transactionId}
        />
        <TransactionPayments />
      </Box>

      <CustomDialog title="Post" isOpen={open} handleDialogClose={dialogClose}>
        <Post id={selectedHeader.id as number} />
      </CustomDialog>
    </>
  );
};
