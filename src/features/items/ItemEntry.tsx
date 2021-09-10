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
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import Save from "@material-ui/icons/Save";

export const ItemEntry = () => {
  const { id } = useParams() as {
    id: string;
  };
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    displayName: "",
    id: undefined,
    type: CategoryType.ItemCategory,
  });
  const [selectedUom, setSelectedUom] = useState<Category>({
    displayName: "",
    id: undefined,
    type: CategoryType.UnitOfMeasure,
  });
  const { loading, error, success, selectedItem, categories, uoms } =
    useAppSelector(selectItems);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id && id !== "0") {
      dispatch(getItem(parseInt(id)));
    } else {
      resetFields();
    }
    dispatch(fetchItemCategories("all"));
    dispatch(fetchItemUoms("all"));
    dispatch(changePageTitle(`Item Detail`));
  }, []);

  if (success) {
    dispatch(resetSelectedItem());
    dispatch(resetSuccess());
  }
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
    dispatch(removeItemCategory(id));
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
        <Button color="secondary" component={RouterLink} to={"/app/items"}>
          <Backspace /> Back to Items List
        </Button>
        <Button color="secondary" onClick={resetFields}>
          <Add /> Add New Item
        </Button>
      </Box>
      <Box>
        <Container maxWidth="sm">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="div">
              Add/Edit Item
            </Typography>
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
                      <FormikTextField formikKey="displayName" label="Name" />
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
                      <FormikTextField
                        formikKey="description"
                        label="Description"
                      />
                      <FormikTextField formikKey="code" label="Code" />
                      <FormikTextField
                        formikKey="purchasePrice"
                        label="Purchasing Price"
                        type={"number"}
                      />
                      <FormikTextField
                        formikKey="sellingPrice"
                        label="Selling Price"
                        type={"number"}
                      />
                      <FormikTextField
                        formikKey="safeQty"
                        label="Safe Qty."
                        type={"number"}
                      />

                      <br />
                      {error && <Toast severity="error">{error.message}</Toast>}
                      <Box component="div" mt={1} width="100%">
                        <Button
                          type="submit"
                          color="secondary"
                          variant="contained"
                          disabled={!props.isValid}
                        >
                          Save Item
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </>
            )}
          </Box>
        </Container>
      </Box>

      <Grid container>
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
              setSelectedCategory({
                displayName: "",
                id: undefined,
                type: CategoryType.ItemCategory,
              });
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
                  {error && <Toast severity="error">{error.message}</Toast>}
                  <Box component="div" ml={1}>
                    <Button
                      type="submit"
                      color="secondary"
                      variant="contained"
                      disabled={!props.isValid}
                    >
                      <Save /> Save Category
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a simple table">
              <TableBody>
                {loading === "pending" ? (
                  <TableRow>
                    <TableCell>
                      <Skeleton variant="rectangular" height={10} width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" height={10} width={100} />
                    </TableCell>
                  </TableRow>
                ) : (
                  categories &&
                  categories.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.displayName}
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              SetSelectedCategory(row ? (row.id as number) : 0)
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
                      </TableCell>
                    </TableRow>
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
              dispatch(addItemCategory(values));
              setSelectedUom({
                displayName: "",
                id: undefined,
                type: CategoryType.UnitOfMeasure,
              });
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
                  {error && <Toast severity="error">{error.message}</Toast>}
                  <Box component="div" ml={1}>
                    <Button
                      type="submit"
                      color="secondary"
                      variant="contained"
                      disabled={!props.isValid}
                    >
                      <Save /> Save UOM
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a simple table">
              <TableBody>
                {loading === "pending" ? (
                  <TableRow>
                    <TableCell>
                      <Skeleton variant="rectangular" height={10} width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" height={10} width={100} />
                    </TableCell>
                  </TableRow>
                ) : (
                  uoms &&
                  uoms.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.displayName}
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};
