import { useEffect } from "react";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";

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
} from "./transactionsSlice";
import {
  TransactionLine,
  TransactionHeader,
  HeaderProps,
} from "./types/transactionTypes";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import { changePageTitle } from "../settings/settingsSlice";
import { Add, Backspace, Delete, Edit } from "@material-ui/icons";
import {
  Grid,
  MenuItem,
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

export const TransactionEntry = ({ type }: HeaderProps) => {
  const { id } = useParams() as {
    id: string;
  };
  const dispatch = useAppDispatch();

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
      const hd = headers.find((h) => h.id === parseInt(id));
      let ln: TransactionLine = { header: hd };
      dispatch(setSelectedLine(ln));
      dispatch(fetchLines(parseInt(id)));
    } else {
      resetFields();
    }
  }, [type]);

  function resetFields() {
    const hd: TransactionHeader = {
      type,
      transactionDate: new Date(),
      number: "...",
    };
    let ln: TransactionLine = { header: hd };
    dispatch(setSelectedLine(ln));
    dispatch(resetLines());
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
        <Button color="secondary" variant="contained" onClick={resetFields}>
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Add />
          </Typography>
        </Button>
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
                  initialValues={selectedLine as TransactionLine}
                  onSubmit={(values, actions) => {
                    actions.setSubmitting(false);
                    //dispatch(addTransactionLine(values));
                  }}
                >
                  {(props: FormikProps<TransactionLine>) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item sm={4} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                              label={type + " Date"}
                              inputFormat="dd/MM/yyyy"
                              minDate={new Date("2021-01-01")}
                              value={props.values.header?.transactionDate}
                              onChange={props.handleChange}
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

                        <Grid item sm={4} xs={12}>
                          <TextField
                            value={props.values.header?.number}
                            variant="outlined"
                            fullWidth
                            disabled
                          />
                        </Grid>

                        <Grid item sm={4} xs={12}>
                          <TextField
                            value={
                              props.values.header?.businessPartner?.displayName
                            }
                            variant="outlined"
                            fullWidth
                            disabled
                          />
                        </Grid>
                      </Grid>

                      <Divider variant="middle" sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item sm={4} xs={12}>
                          <Autocomplete
                            id="itemId"
                            options={items}
                            getOptionLabel={(option) =>
                              option.displayName as string
                            }
                            sx={{ mt: 1 }}
                            onChange={(e, value) => {
                              props.setFieldValue(
                                "itemId",
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
                            formikKey="Qty"
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
                            sx={{ width: "100%", mt: 1, p: 2 }}
                            type="submit"
                            color="secondary"
                            variant="contained"
                            disabled={!props.isValid}
                          >
                            <Save /> Add Item
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

                      <StyledTableCell sx={{ padding: "0px 16px" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <IconButton color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton color="secondary">
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
                    {selectedLine.header?.numberOfItems} Items
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ fontWeight: "900" }}
                    scope="row"
                    align="right"
                  >
                    Total Qty: {selectedLine.header?.totalQty}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ fontWeight: "900", fontSize: "24px" }}
                    scope="row"
                    align="right"
                  >
                    Total Amount : {selectedLine.header?.totalAmount}
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
