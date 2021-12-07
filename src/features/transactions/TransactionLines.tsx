import { useEffect, useState } from "react";
//import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import { Form, FormikProps, Formik } from "formik";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import {
  selectTransactions,
  setSelectedLine,
  addLine,
  removeLine,
  fetchLines,
  fetchInventories,
} from "./transactionsSlice";
import {
  TransactionLine,
  TransactionStatus,
  TransactionType,
  Inventory,
  HeaderLineProps,
} from "./types/transactionTypes";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import { Delete, Edit } from "@mui/icons-material";
import {
  Grid,
  TextField,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableBody,
  Stack,
  IconButton,
  Autocomplete,
} from "@mui/material";
import Save from "@mui/icons-material/Save";
import { StyledTableCell, StyledTableRow } from "../../styles/tableStyles";
import { Item } from "../setups/types/itemTypes";
import { lineSchema } from "./validation";
import { selectAuth } from "../auth/authSlice";
import { isPrivilegedTransaction } from "../../utils/authUtils";
import { Role } from "../auth/types/authType";
import { selectSetups } from "../setups/setupSlices";
import { selectPreference } from "../preferences/preferencesSlice";
import Paging from "../../components/Layout/Paging";

export const TransactionLines = ({
  tranHeader,
  type,
  headerId,
}: HeaderLineProps) => {
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [selectedInventory, setSelectedInventory] = useState<Inventory>({
    qtyOnHand: 0,
  });
  const [tranLine, setTranLine] = useState<TransactionLine>({});
  const [leftItems, setLeftItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const { searchText } = useAppSelector(selectPreference);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  //const { searchText } = useAppSelector(selectPreference);
  const {
    itemsWithCount: { items },
  } = useAppSelector(selectSetups);

  const {
    headerLinesWithCount: { lines, totalCount },
    selectedHeader,
    selectedLine,
    inventoriesWithCount: { inventories },
  } = useAppSelector(selectTransactions);

  useEffect(() => {
    setTotal(totalCount as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount]);

  useEffect(() => {
    if (selectedHeader && selectedHeader.id && selectedHeader.id !== 0) {
      const skipRows = currentPage * rowsPerPage;
      dispatch(
        fetchLines({
          headerId: parseInt(headerId),
          searchText:
            searchText && searchText.length > 0 ? searchText : undefined,
          skip: skipRows,
          take: rowsPerPage,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedHeader, searchText, currentPage, rowsPerPage]);

  useEffect(() => {
    setLeftItems(items.filter((i) => !lines.some((l) => l.item?.id === i.id)));
  }, [lines, items]);

  useEffect(() => {
    setTranLine(selectedLine);
  }, [selectedLine]);

  useEffect(() => {
    if (selectedItemId !== 0) {
      dispatch(
        fetchInventories({
          warehouseId: tranHeader.warehouse?.id,
          itemId: selectedItemId,
          refreshList: "refresh",
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId]);

  useEffect(() => {
    if (inventories.length > 0) {
      setSelectedInventory(inventories[0] as Inventory);
    } else setSelectedInventory({ qtyOnHand: 0 });
  }, [inventories]);

  const DeleteLine = (id: number) => {
    dispatch(removeLine(id));
  };
  const SetSelectedLine = (id: number) => {
    dispatch(
      setSelectedLine(lines.find((cat) => cat.id === id) as TransactionLine)
    );
  };

  return (
    <>
      <Accordion sx={{ my: 1 }} expanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Items</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {selectedHeader?.status === TransactionStatus.Draft &&
            isPrivilegedTransaction(user?.roles as Role[], type, "Add") && (
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
            )}
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No</StyledTableCell>
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
                  lines.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell scope="row" sx={{ padding: "0px 16px" }}>
                        {currentPage * rowsPerPage + index + 1}
                      </StyledTableCell>
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
                    {selectedHeader?.numberOfItems?.toLocaleString()} Items
                  </StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell
                    sx={{ fontWeight: "900" }}
                    scope="row"
                    align="right"
                  >
                    Total Qty: {selectedHeader?.totalQty?.toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell></StyledTableCell>

                  <StyledTableCell
                    sx={{ fontWeight: "900", fontSize: "24px" }}
                    scope="row"
                    align="right"
                  >
                    Total Amount :{" "}
                    {selectedHeader?.totalAmount?.toLocaleString()}
                  </StyledTableCell>

                  <StyledTableCell></StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Stack spacing={1}>
            <Paging
              total={total}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              setRowsPerPage={setRowsPerPage}
              setCurrentPage={setCurrentPage}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
