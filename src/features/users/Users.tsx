import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsers, selectUsers, signUpFederatedUser } from "./usersSlice";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import { NavLink as RouterLink } from "react-router-dom";

import { changePageTitle } from "../settings/settingsSlice";
import Avatar from "@material-ui/core/Avatar";
import {
  Box,
  IconButton,
  Stack,
  Button,
  Typography,
  Divider,
} from "@material-ui/core";
import { Add, Edit, Save, Delete } from "@material-ui/icons";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Form, Formik, FormikProps } from "formik";
import { FormikTextField } from "../../components/Layout/FormikTextField";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import TableSkeleton from "../../components/Layout/TableSkeleton";
import { createUserSchema } from "../setups/validation";
import { CreateUser } from "../auth/types/authType";
import { selectAuth } from "../auth/authSlice";

const defaultUser: CreateUser = {
  email: "",
  clientId: 0,
};

export const Users = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedUser, setSelectedUser] = useState(defaultUser);

  const dispatch = useAppDispatch();
  const { entities: users, loading } = useAppSelector(selectUsers);
  const { user } = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(fetchUsers("all"));
    dispatch(changePageTitle("Users List"));
  }, [dispatch]);

  const ToggleAccordion = () => {
    setExpanded(!expanded);
  };
  const DeleteUser = (id: number) => {
    //dispatch(removeUser(id));
  };

  const ResetFields = () => {
    setSelectedUser(defaultUser);
    setExpanded(true);
  };
  return (
    <>
      <Helmet>
        <title>Users | Pinna Stock</title>
      </Helmet>
      <Box component="div">
        <Button color="secondary" variant="contained" onClick={ResetFields}>
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Add /> Add New User
          </Typography>
        </Button>
      </Box>
      <Divider variant="middle" sx={{ my: 2 }} />

      <Formik
        enableReinitialize={true}
        initialValues={selectedUser as CreateUser}
        validationSchema={createUserSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          if (user && user.client) {
            values = { ...values, clientId: user.client.id as number };
          }
          dispatch(signUpFederatedUser(values));
        }}
      >
        {(props: FormikProps<CreateUser>) => (
          <Form>
            <Accordion sx={{ m: 1 }} expanded={expanded}>
              <AccordionSummary
                onClick={ToggleAccordion}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Detail</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormikTextField formikKey="email" label="Email" />
                  </Grid>
                </Grid>

                <br />
                {/* {success && <Toast severity="success">{success.message}</Toast>}
                {error && <Toast severity="error">{error.message}</Toast>} */}
                <Button
                  sx={{ width: "100%" }}
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={!props.isValid}
                >
                  <Save />
                  Save User
                </Button>
              </AccordionDetails>
            </Accordion>
          </Form>
        )}
      </Formik>

      <Divider variant="middle" sx={{ my: 2 }} />
      <Grid container justifyContent="flex-start">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Photo</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <TableSkeleton numRows={5} numColumns={3} />
              ) : (
                users.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>
                      <Avatar
                        alt="avatar"
                        src={row.avatar}
                        sx={{
                          width: 64,
                          height: 64,
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>

                    <StyledTableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          color="primary"
                          component={RouterLink}
                          to={"/app/user/" + row.id}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => DeleteUser(row.id as number)}
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
    </>
  );
};
