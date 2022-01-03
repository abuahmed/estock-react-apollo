import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";
import { NavLink as RouterLink } from "react-router-dom";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import { StyledAccordionSummary } from "../../styles/componentStyled";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { accountSchema } from "./validation";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Toast from "../../components/Layout/Toast";

import {
  selectSetups,
  fetchCategories,
  getFinancialAccount,
  resetSelectedFinancialAccount,
  addFinancialAccount,
  selectBanks,
} from "./setupSlices";
import { CategoryType } from "./types/itemTypes";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import { changePageTitle } from "../preferences/preferencesSlice";
import { Add, Backspace } from "@mui/icons-material";
import {
  Grid,
  TextField,
  Divider,
  LinearProgress,
  Stack,
  Autocomplete,
} from "@mui/material";
import Save from "@mui/icons-material/Save";
import { CategoryEntry } from "./items/CategoryEntry";
import CustomDialog from "../../components/modals/CustomDialog";
import { FinancialAccount } from "../transactions/types/paymentTypes";

export const FinancialAccountEntry = () => {
  const { id } = useParams() as {
    id: string;
  };
  const [open, setOpen] = useState(false);

  const { loading, error, success, selectedFinancialAccount } =
    useAppSelector(selectSetups);
  const dispatch = useAppDispatch();
  const banks = useAppSelector(selectBanks);
  useEffect(() => {
    dispatch(changePageTitle(`Financial Account Entry`));

    if (id && id !== "0") {
      dispatch(getFinancialAccount(parseInt(id)));
    } else {
      resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    if (!open) {
      dispatch(fetchCategories({ skip: 0, take: -1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function resetFields() {
    dispatch(resetSelectedFinancialAccount());
  }
  const openCategoryHandler = () => {
    setOpen(true);
  };
  const dialogClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Helmet>
        <title>Financial Account Entry | Pinna Stock</title>
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
          to={"/app/fa"}
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
            initialValues={selectedFinancialAccount as FinancialAccount}
            validationSchema={accountSchema}
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              dispatch(addFinancialAccount(values));
            }}
          >
            {(props: FormikProps<FinancialAccount>) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12}>
                    <FormikTextField
                      formikKey="accountNumber"
                      label="Account Number"
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <FormikTextField formikKey="branch" label="Branch" />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Stack direction="row">
                      <Autocomplete
                        sx={{ width: "100%" }}
                        id="bankId"
                        options={banks}
                        value={props.values?.bank}
                        getOptionLabel={(option) =>
                          option.displayName as string
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        onChange={(e, value) => {
                          props.setFieldValue(
                            "bank",
                            value !== null ? value : null
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            sx={{ mt: 1, width: "100%" }}
                            label="Bank"
                            name="bankId"
                            {...params}
                          />
                        )}
                      />

                      <Button
                        sx={{ mt: 1, p: 0 }}
                        color="secondary"
                        variant="outlined"
                        onClick={openCategoryHandler}
                      >
                        <Add />
                      </Button>
                    </Stack>
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
                          formikKey="accountFormat"
                          label="Account Format"
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <FormikTextField formikKey="iban" label="Iban" />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <FormikTextField
                          formikKey="swiftCode"
                          label="Swift Code"
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
                  Save Financial Account
                </Button>
              </Form>
            )}
          </Formik>
        </>
      </Box>

      {/* <Divider variant="middle" sx={{ my: 2 }} /> */}
      {loading === "pending" && <LinearProgress color="secondary" />}

      <CustomDialog title="Banks" isOpen={open} handleDialogClose={dialogClose}>
        <CategoryEntry categoryType={CategoryType.Bank} />
      </CustomDialog>
    </>
  );
};
