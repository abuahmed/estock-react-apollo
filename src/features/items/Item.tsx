import react, { useEffect } from "react";

import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/styles";

import ItemSkeleton from "./ItemSkeleton";

import { registerSchema } from "./validation";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Toast from "../../components/Layout/Toast";

import { addItem, selectItems, resetSuccess, getItem } from "./itemsSlice";
import { Item as ItemType } from "./types/itemType";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import { changePageTitle } from "../settings/settingsSlice";

export const Item = () => {
  const { id } = useParams() as {
    id: string;
  };
  const theme = useTheme();

  const { loading, error, success, selectedItem } = useAppSelector(selectItems);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getItem(parseInt(id)));
      dispatch(changePageTitle(`Item Detail`));
    }
  }, []);

  if (success) {
    //return <Navigate to='/' />;
    dispatch(resetSuccess());
    navigate("/app/items");
  }

  return (
    <>
      <Helmet>
        <title>Item Entry | Pinna Stock</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="div">
              Welcome!
            </Typography>
            <Typography variant="h4" component="div">
              Create your account
            </Typography>
            {/* {success && redirectToLogin} */}
            {loading === "pending" ? (
              <ItemSkeleton />
            ) : (
              <>
                <Formik
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

                      <FormikTextField
                        formikKey="description"
                        label="Description"
                      />
                      <FormikTextField formikKey="code" label="Code" />
                      <FormikTextField
                        formikKey="purchasePrice"
                        label="Purchasing Price"
                      />
                      <FormikTextField
                        formikKey="sellingPrice"
                        label="Selling Price"
                      />
                      <FormikTextField formikKey="safeQty" label="Safe Qty." />
                      <br />
                      {error && <Toast severity="error">{error.message}</Toast>}
                      <Box component="div" mt={1}>
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
    </>
  );
};
