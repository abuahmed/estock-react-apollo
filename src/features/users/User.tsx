import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import SaveIcon from "@material-ui/icons/Save";

// Slices
// import { AuthUser as UserType } from "../auth/types/authType";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUser, selectUsers } from "./usersSlice";
import { AuthState, AuthUser } from "../auth/types/authType";
import Grid from "@material-ui/core/Grid";
import { Form, Formik, FormikProps } from "formik";
import { FormikTextField } from "../../components/Layout/FormikTextField";
import Paper from "@material-ui/core/Paper";
import { profileUpdateSchema } from "../auth/validation";
import Toast from "../../components/Layout/Toast";
import Button from "@material-ui/core/Button";
import { updateProfile } from "../auth/authSlice";
import { Divider } from "@material-ui/core";
import AuthSkeleton from "../auth/AuthSkeleton";
import { changePageTitle } from "../settings/settingsSlice";

// type Props = {
//   user: UserType;
// };

export const User = () => {
  // const [selectedUser, setCurrentUser] = useState<AuthUser>();
  const { id } = useParams() as {
    id: string;
  };
  const { selectedUser, loading, error } = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  //let currentUser: AuthUser | undefined;
  useEffect(() => {
    if (id) {
      dispatch(getUser(parseInt(id)));
      dispatch(changePageTitle("User Detail"));
    }
    //console.log(selectedUser);
    //console.log(id);
  }, []);

  return (
    <Paper
      elevation={3}
      style={{
        position: "relative",
        borderRadius: 18,
      }}
    >
      {loading === "pending" ? (
        <AuthSkeleton />
      ) : (
        <Formik
          initialValues={selectedUser as AuthUser}
          validationSchema={profileUpdateSchema}
          onSubmit={(values, actions) => {
            actions.setSubmitting(false);

            dispatch(updateProfile(values));
          }}
        >
          {(props: FormikProps<AuthUser>) => (
            <Form>
              <Box m={1}>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <FormikTextField formikKey="name" label="Name" disabled />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormikTextField formikKey="email" label="Bio" disabled />
                  </Grid>
                </Grid>

                <Divider orientation="horizontal" sx={{ m: "10px" }} />

                {error && <Toast severity="error">{error.message}</Toast>}
                <Box component="div" pb={3} mt={3}>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    disabled={!props.isValid}
                  >
                    <SaveIcon /> Save Changes
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Paper>
  );
};
