import react, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";
import { NavLink as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/styles";

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
} from "./itemsSlice";
import { Item as ItemType } from "./types/itemType";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import { changePageTitle } from "../settings/settingsSlice";
import { Add, Backspace } from "@material-ui/icons";

export const defaultItemValues = {};
export const ItemEntry = () => {
  const [currentItem, setCurrentItem] = useState<ItemType>({});
  const { id } = useParams() as {
    id: string;
  };
  const { loading, error, success, selectedItem } = useAppSelector(selectItems);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  //let [defaultItemValues, setDefaultItemValues] = useState({ displayName: "" });
  useEffect(() => {
    if (id && id !== "0") {
      dispatch(getItem(parseInt(id)));
    }
    // else {
    //   dispatch(resetSelectedItem());
    // }
    dispatch(changePageTitle(`Item Detail`));
  }, []);

  // if (selectedItem) {
  //   setCurrentItem(selectedItem);
  // } else {
  //   setCurrentItem({ displayName: "" });
  // }
  if (success) {
    //return <Navigate to='/' />;
    dispatch(resetSuccess());
    navigate("/app/items");
  }
  function resetFields() {
    dispatch(resetSelectedItem());
  }
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
