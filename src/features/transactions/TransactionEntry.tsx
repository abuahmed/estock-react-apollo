import { useEffect, useState } from "react";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
//import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import DateTimePicker from "@material-ui/lab/DateTimePicker";

import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";
import { NavLink as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import TransactionSkeleton from "./TransactionSkeleton";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Toast from "../../components/Layout/Toast";

import {
  fetchLines,
  selectTransactions,
  setSelectedLine,
  resetLines,
  setSelectedHeader,
  fetchHeaders,
  addLine,
  removeLine,
  postHeader,
} from "./transactionsSlice";
import {
  TransactionLine,
  TransactionHeader,
  HeaderProps,
} from "./types/transactionTypes";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import { changePageTitle } from "../settings/settingsSlice";
import { Add, Backspace, Delete, Edit, PostAdd } from "@material-ui/icons";
import {
  Grid,
  TextField,
  Divider,
  TableContainer,
  Table,
  TableHead,
  Paper,
  Skeleton,
  TableBody,
  Stack,
  IconButton,
  Autocomplete,
} from "@material-ui/core";
import Save from "@material-ui/icons/Save";
import { selectItems } from "../items/itemsSlice";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import { Item } from "../items/types/itemTypes";
import { lineSchema } from "./validation";

export const TransactionEntry = ({ type }: HeaderProps) => {
  const { id } = useParams() as {
    id: string;
  };
  const [tranHeader, setTranHeader] = useState<TransactionHeader>({ type });
  const [tranLine, setTranLine] = useState<TransactionLine>({});
  const dispatch = useAppDispatch();
  const [leftItems, setLeftItems] = useState<Item[]>([]);
  const { items } = useAppSelector(selectItems);

  const {
    headers,
    lines,
    selectedHeader,
    selectedLine,
    loading,
    success,
    error,
  } = useAppSelector(selectTransactions);

  useEffect(() => {
    dispatch(changePageTitle(`${type} Entry`));
    if (id && id !== "0") {
      if (headers.length === 0) {
        dispatch(fetchHeaders({ type }));
      } else {
        const hd = headers.find((h) => h.id === parseInt(id));
        let ln: TransactionLine = {
          header: hd,
          item: { displayName: "select item", id: 0 },
          qty: 0,
          eachPrice: 0,
        };
        dispatch(setSelectedHeader(hd));
        dispatch(setSelectedLine(ln));
        dispatch(fetchLines({ headerId: parseInt(id) }));
      }
    } else {
      resetFields();
    }
  }, [dispatch, type, headers, id]);

  useEffect(() => {
    setLeftItems(items.filter((i) => !lines.some((l) => l.item?.id === i.id)));
  }, [lines, items]);

  useEffect(() => {
    setTranHeader(selectedHeader);
  }, [selectedHeader]);

  useEffect(() => {
    setTranLine(selectedLine);
  }, [selectedLine]);

  function resetFields() {
    const hd: TransactionHeader = {
      type,
      transactionDate: new Date(),
      number: "...",
    };
    dispatch(setSelectedHeader(hd));
    let ln: TransactionLine = {
      header: hd,
      item: { displayName: "select item", id: 0 },
      qty: 0,
      eachPrice: 0,
    };
    dispatch(setSelectedLine(ln));
    dispatch(resetLines());
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
  function postTransaction() {
    dispatch(postHeader(selectedHeader.id as number));
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
          <Button color="secondary" variant="contained" onClick={resetFields}>
            <Typography
              variant="h5"
              component="h5"
              sx={{ display: "flex", justifyItems: "center" }}
            >
              <Add />
            </Typography>
          </Button>
          <Button
            sx={{ display: { xs: "none", sm: "block" } }}
            color="secondary"
            variant="contained"
            onClick={resetFields}
          >
            <Typography
              variant="h5"
              component="h5"
              sx={{ display: "flex", justifyItems: "center" }}
              onClick={postTransaction}
            >
              <PostAdd />
              POST
            </Typography>
          </Button>
        </Stack>
      </Box>
      <Divider variant="middle" sx={{ my: 2 }} />

      <Box>
        {success && <Toast severity="success">{success.message}</Toast>}
        {error && <Toast severity="error">{error.message}</Toast>}

        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            {loading === "pending" ? (
              <TransactionSkeleton />
            ) : (
              <>
                <Formik
                  enableReinitialize={true}
                  initialValues={tranHeader as TransactionHeader}
                  onSubmit={(values, actions) => {
                    actions.setSubmitting(false);
                    //dispatch(addTransactionHeader(values));
                  }}
                >
                  {(props: FormikProps<TransactionHeader>) => (
                    <Form>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item sm={4} xs={12}>
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

                        <Grid item sm={2} xs={12}>
                          <TextField
                            value={props.values.number}
                            variant="outlined"
                            fullWidth
                            disabled
                          />
                        </Grid>

                        <Grid item sm={2} xs={12}>
                          <TextField
                            value={props.values.businessPartner?.displayName}
                            variant="outlined"
                            fullWidth
                            disabled
                          />
                        </Grid>
                        <Grid item sm={2} xs={12}>
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
                <Divider variant="middle" sx={{ my: 2 }} />
                <Formik
                  enableReinitialize={true}
                  validationSchema={lineSchema}
                  initialValues={tranLine as TransactionLine}
                  onSubmit={(values, actions) => {
                    actions.setSubmitting(false);
                    values = { ...values, header: { ...tranHeader, type } };
                    //console.log(values);
                    dispatch(addLine(values));
                  }}
                >
                  {(props: FormikProps<TransactionLine>) => (
                    <Form>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item sm={4} xs={12}>
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
                        <Grid item sm={2} xs={12}>
                          <FormikTextField
                            formikKey="qty"
                            label="Quantity"
                            type={"number"}
                          />
                        </Grid>
                        <Grid item sm={2} xs={12}>
                          <FormikTextField
                            formikKey="eachPrice"
                            label="Each Price"
                            type={"number"}
                          />
                        </Grid>
                        <Grid item sm={2} xs={12}>
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
            )}
          </Box>

          <TableContainer component={Paper} sx={{ mt: "8px" }}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Item Name</StyledTableCell>
                  <StyledTableCell align="right">Qty</StyledTableCell>
                  <StyledTableCell align="right">Each Price</StyledTableCell>
                  <StyledTableCell align="right">Total Price</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {loading === "pending" ? (
                  <StyledTableRow>
                    <StyledTableCell>
                      <Skeleton variant="rectangular" height={10} width={100} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton variant="rectangular" height={10} width={100} />
                    </StyledTableCell>
                  </StyledTableRow>
                ) : (
                  lines &&
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
                        {row.qty}
                      </StyledTableCell>
                      <StyledTableCell
                        scope="row"
                        sx={{ padding: "0px 16px" }}
                        align="right"
                      >
                        {row.eachPrice}
                      </StyledTableCell>
                      <StyledTableCell
                        scope="row"
                        sx={{ padding: "0px 16px" }}
                        align="right"
                      >
                        {(row.qty as number) * (row.eachPrice as number)}
                      </StyledTableCell>

                      <StyledTableCell sx={{ padding: "0px 16px" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              SetSelectedLine(row ? (row.id as number) : 0)
                            }
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() =>
                              DeleteLine(row ? (row.id as number) : 0)
                            }
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
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
    </>
  );
};
