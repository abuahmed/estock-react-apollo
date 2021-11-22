import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";
import { NavLink as RouterLink } from "react-router-dom";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import { StyledAccordionSummary } from "../../styles/componentStyled";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { registerSchema } from "./validation";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Toast from "../../components/Layout/Toast";

import {
  addItem,
  selectSetups,
  getItem,
  resetSelectedItem,
  fetchCategories,
} from "./setupSlices";
import { CategoryType, Item as ItemType } from "./types/itemTypes";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import { changePageTitle } from "../preferences/preferencesSlice";
import { Add, Backspace } from "@mui/icons-material";
import {
  Grid,
  MenuItem,
  TextField,
  Divider,
  LinearProgress,
  Stack,
  Autocomplete,
} from "@mui/material";
import Save from "@mui/icons-material/Save";
import { CategoryEntry } from "./items/CategoryEntry";
import CustomDialog from "../../components/modals/CustomDialog";

export const ItemEntry = () => {
  const { id } = useParams() as {
    id: string;
  };
  const [open, setOpen] = useState(false);
  const [categoryType, setCategoryType] = useState<CategoryType>(
    CategoryType.ItemCategory
  );

  const { loading, error, success, selectedItem, categories, uoms } =
    useAppSelector(selectSetups);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changePageTitle(`Item Entry`));

    if (id && id !== "0") {
      dispatch(getItem(parseInt(id)));
    } else {
      resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    if (!open) {
      dispatch(
        fetchCategories({ type: CategoryType.ItemCategory, skip: 0, take: -1 })
      );
      dispatch(
        fetchCategories({ type: CategoryType.UnitOfMeasure, skip: 0, take: -1 })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function resetFields() {
    dispatch(resetSelectedItem());
  }
  const openCategoryHandler = (catType: CategoryType) => {
    setOpen(true);
    setCategoryType(catType);
  };
  const dialogClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Helmet>
        <title>Item Entry | Pinna Stock</title>
      </Helmet>
      <Stack
        direction="row"
        justifyContent="space-between"
        justifyItems="center"
      >
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={"/app/items"}
        >
          <Typography variant="h5" component="h5">
            <Backspace />
          </Typography>
        </Button>
        <Button color="secondary" variant="contained" onClick={resetFields}>
          <Typography variant="h5" component="h5">
            <Add />
          </Typography>
        </Button>
      </Stack>
      <Divider variant="middle" sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
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
                  <Grid item md={4} xs={12}>
                    <FormikTextField formikKey="displayName" label="Name" />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Stack direction="row">
                      <Autocomplete
                        sx={{ width: "100%" }}
                        id="itemCategoryId"
                        options={categories}
                        value={props.values?.itemCategory}
                        getOptionLabel={(option) =>
                          option.displayName as string
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        onChange={(e, value) => {
                          props.setFieldValue(
                            "itemCategory",
                            value !== null ? value : null
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            sx={{ mt: 1, width: "100%" }}
                            label="Item Category"
                            name="itemCategoryId"
                            {...params}
                          />
                        )}
                      />

                      <Button
                        sx={{ mt: 1, p: 0 }}
                        color="secondary"
                        variant="outlined"
                        onClick={() =>
                          openCategoryHandler(CategoryType.ItemCategory)
                        }
                      >
                        <Add />
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Stack direction="row">
                      <Autocomplete
                        sx={{ width: "100%" }}
                        id="unitOfMeasureId"
                        options={uoms}
                        value={props.values?.unitOfMeasure}
                        getOptionLabel={(option) =>
                          option.displayName as string
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        onChange={(e, value) => {
                          props.setFieldValue(
                            "unitOfMeasure",
                            value !== null ? value : null
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            sx={{ mt: 1, width: "100%" }}
                            label="Unit Of Measure"
                            name="unitOfMeasureId"
                            {...params}
                          />
                        )}
                      />
                      <Button
                        sx={{ mt: 1, p: 0 }}
                        color="secondary"
                        variant="outlined"
                        onClick={() =>
                          openCategoryHandler(CategoryType.UnitOfMeasure)
                        }
                      >
                        <Add />
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormikTextField
                      formikKey="description"
                      label="Description"
                    />
                  </Grid>
                </Grid>

                <Accordion sx={{ mt: 1 }}>
                  <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>More Detail</Typography>
                  </StyledAccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item md={4} xs={12}>
                        <FormikTextField
                          formikKey="purchasePrice"
                          label="Purchasing Price"
                          type={"number"}
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <FormikTextField
                          formikKey="sellingPrice"
                          label="Selling Price"
                          type={"number"}
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <FormikTextField
                          formikKey="safeQty"
                          label="Safe Qty."
                          type={"number"}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <br />
                {success && <Toast severity="success">{success.message}</Toast>}
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
      </Box>

      {/* <Divider variant="middle" sx={{ my: 2 }} /> */}
      {loading === "pending" && <LinearProgress color="secondary" />}

      <CustomDialog
        title={
          categoryType === CategoryType.ItemCategory
            ? "Item Categories"
            : "Unit of Measures"
        }
        isOpen={open}
        handleDialogClose={dialogClose}
      >
        {categoryType === CategoryType.ItemCategory ? (
          <CategoryEntry categoryType={CategoryType.ItemCategory} />
        ) : (
          <CategoryEntry categoryType={CategoryType.UnitOfMeasure} />
        )}
      </CustomDialog>
    </>
  );
};
