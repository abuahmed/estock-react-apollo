import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";
import { NavLink as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import ItemSkeleton from "./ItemSkeleton";

import { registerSchema } from "./validation";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Toast from "../../components/Layout/Toast";

import {
  addItem,
  selectItems,
  resetSuccess,
  getItem,
  resetSelectedItem,
  fetchItemCategories,
  fetchItemUoms,
  addItemCategory,
  removeItemCategory,
  addItemUom,
  removeItemUom,
} from "./itemsSlice";
import { Category, CategoryType, Item as ItemType } from "./types/itemType";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import { changePageTitle } from "../settings/settingsSlice";
import { Add, Backspace, Delete, Edit } from "@material-ui/icons";
import {
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Divider,
  TableHead,
} from "@material-ui/core";
import Save from "@material-ui/icons/Save";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";

const defaultItemCategory = {
  displayName: "",
  id: undefined,
  type: CategoryType.ItemCategory,
};
const defaultItemUom = {
  displayName: "",
  id: undefined,
  type: CategoryType.UnitOfMeasure,
};
export const ItemEntry = () => {
  const { id } = useParams() as {
    id: string;
  };
  const [selectedCategory, setSelectedCategory] =
    useState<Category>(defaultItemCategory);
  const [selectedUom, setSelectedUom] = useState<Category>(defaultItemUom);
  const { loading, error, success, selectedItem, categories, uoms } =
    useAppSelector(selectItems);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changePageTitle(`Item Entry`));
    if (categories.length === 0) dispatch(fetchItemCategories("all"));
    if (uoms.length === 0) dispatch(fetchItemUoms("all"));
    if (id && id !== "0") {
      dispatch(getItem(parseInt(id)));
    } else {
      resetFields();
    }
  }, []);

  function resetFields() {
    dispatch(resetSelectedItem());
  }
  const DeleteCategory = (id: number) => {
    dispatch(removeItemCategory(id));
  };
  const SetSelectedCategory = (id: number) => {
    setSelectedCategory(categories.find((cat) => cat.id === id) as Category);
  };
  const DeleteUom = (id: number) => {
    dispatch(removeItemUom(id));
  };
  const SetSelectedUom = (id: number) => {
    setSelectedUom(uoms.find((cat) => cat.id === id) as Category);
  };
  return (
    <>
      <Helmet>
        <title>Item Entry | Pinna Stock</title>
      </Helmet>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={"/app/items"}
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
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            {/* <Typography variant="h4" component="div">
              Add/Edit Item
            </Typography> */}
            {/* {success && redirectToLogin} */}
            {loading === "pending" ? (
              <ItemSkeleton />
            ) : (
              <>
                <Formik
                  enableReinitialize={true}
                  initialValues={selectedItem as ItemType}
                  validationSchema={registerSchema}
                  onSubmit={(values, actions) => {
                    actions.setSubmitting(false);
                    dispatch(addItem(values));
                  }}
                >
                  {(props: FormikProps<ItemType>) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item sm={4} xs={12}>
                          <FormikTextField
                            formikKey="displayName"
                            label="Name"
                          />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <TextField
                            fullWidth
                            sx={{ mt: 1 }}
                            variant="outlined"
                            name="itemCategoryId"
                            id="itemCategoryId"
                            select
                            label="Item Category"
                            value={props.values.itemCategoryId}
                            onChange={props.handleChange}
                          >
                            {categories.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.displayName}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <TextField
                            fullWidth
                            sx={{ mt: 1 }}
                            variant="outlined"
                            name="unitOfMeasureId"
                            id="unitOfMeasureId"
                            select
                            label="Unit Of Measure"
                            value={props.values.unitOfMeasureId}
                            onChange={props.handleChange}
                          >
                            {uoms.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.displayName}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item sm={4} xs={12}>
                          <FormikTextField formikKey="code" label="Code" />
                        </Grid>
                        <Grid item sm={8} xs={12}>
                          <FormikTextField
                            formikKey="description"
                            label="Description"
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item sm={4} xs={12}>
                          <FormikTextField
                            formikKey="purchasePrice"
                            label="Purchasing Price"
                            type={"number"}
                          />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <FormikTextField
                            formikKey="sellingPrice"
                            label="Selling Price"
                            type={"number"}
                          />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <FormikTextField
                            formikKey="safeQty"
                            label="Safe Qty."
                            type={"number"}
                          />
                        </Grid>
                      </Grid>

                      {/* <Grid container>
                        <Grid item sm={4} xs={12}></Grid>
                        <Grid item sm={4} xs={12}></Grid>
                        <Grid item sm={4} xs={12}></Grid>
                      </Grid> */}

                      <br />
                      {success && (
                        <Toast severity="success">{success.message}</Toast>
                      )}
                      {error && <Toast severity="error">{error.message}</Toast>}
                      <Button
                        sx={{ width: "100%" }}
                        type="submit"
                        color="secondary"
                        variant="contained"
                        disabled={!props.isValid}
                      >
                        <Save />
                        Save Item
                      </Button>
                    </Form>
                  )}
                </Formik>
              </>
            )}
          </Box>
        </Container>
      </Box>
      <Divider variant="middle" sx={{ my: 2 }} />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item md={6} xs={12} justifyContent="flex-start">
            <Typography variant="h6" component="div">
              {categories.length} Item Categories
            </Typography>
            <Formik
              enableReinitialize={true}
              initialValues={selectedCategory as Category}
              validationSchema={registerSchema}
              onSubmit={(values, actions) => {
                actions.setSubmitting(false);
                dispatch(addItemCategory(values));
                setSelectedCategory(defaultItemCategory);
              }}
            >
              {(props: FormikProps<Category>) => (
                <Form>
                  <Stack direction="row">
                    <FormikTextField
                      sx={{ width: "240px" }}
                      formikKey="displayName"
                      label="Name"
                    />
                    <Button
                      sx={{ ml: "8px" }}
                      type="submit"
                      color="secondary"
                      variant="contained"
                      disabled={!props.isValid}
                    >
                      <Save />
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
            <TableContainer component={Paper} sx={{ mt: "8px" }}>
              <Table size="small" aria-label="a simple table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Category Name</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {loading === "pending" ? (
                    <StyledTableRow>
                      <StyledTableCell>
                        <Skeleton
                          variant="rectangular"
                          height={10}
                          width={100}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton
                          variant="rectangular"
                          height={10}
                          width={100}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    categories &&
                    categories.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.displayName}
                        </StyledTableCell>

                        <StyledTableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <IconButton
                              color="primary"
                              onClick={() =>
                                SetSelectedCategory(
                                  row ? (row.id as number) : 0
                                )
                              }
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="secondary"
                              onClick={() =>
                                DeleteCategory(row ? (row.id as number) : 0)
                              }
                            >
                              <Delete />
                            </IconButton>
                          </Stack>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item md={6} xs={12} justifyContent="flex-start">
            <Typography variant="h6" component="div">
              {uoms.length} Unit Of Measures
            </Typography>
            <Formik
              enableReinitialize={true}
              initialValues={selectedUom as Category}
              validationSchema={registerSchema}
              onSubmit={(values, actions) => {
                actions.setSubmitting(false);
                dispatch(addItemUom(values));
                setSelectedUom(defaultItemUom);
              }}
            >
              {(props: FormikProps<Category>) => (
                <Form>
                  <Stack direction="row">
                    <FormikTextField
                      sx={{ width: "240px" }}
                      formikKey="displayName"
                      label="Name"
                    />

                    <Button
                      sx={{ ml: "8px" }}
                      type="submit"
                      color="secondary"
                      variant="contained"
                      disabled={!props.isValid}
                    >
                      <Save />
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
            <TableContainer component={Paper} sx={{ mt: "8px" }}>
              <Table size="small" aria-label="a simple table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>UOM Name</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {loading === "pending" ? (
                    <StyledTableRow>
                      <StyledTableCell>
                        <Skeleton
                          variant="rectangular"
                          height={10}
                          width={100}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton
                          variant="rectangular"
                          height={10}
                          width={100}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    uoms &&
                    uoms.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.displayName}
                        </StyledTableCell>

                        <StyledTableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <IconButton
                              color="primary"
                              onClick={() =>
                                SetSelectedUom(row ? (row.id as number) : 0)
                              }
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="secondary"
                              onClick={() =>
                                DeleteUom(row ? (row.id as number) : 0)
                              }
                            >
                              <Delete />
                            </IconButton>
                          </Stack>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
