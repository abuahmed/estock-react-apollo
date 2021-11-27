import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchUsers, selectSetups, createUser } from "../setupSlices";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { NavLink as RouterLink } from "react-router-dom";

import {
  changePageTitle,
  selectPreference,
} from "../../preferences/preferencesSlice";
import Avatar from "@mui/material/Avatar";
import {
  Box,
  IconButton,
  Stack,
  Button,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Save, Delete, Refresh } from "@mui/icons-material";

import Accordion from "@mui/material/Accordion";
import { StyledAccordionSummary } from "../../../styles/componentStyled";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Form, Formik, FormikProps } from "formik";
import { FormikTextField } from "../../../components/Layout/FormikTextField";
import { StyledTableCell, StyledTableRow } from "../../../styles/tableStyles";
import TableSkeleton from "../../../components/Layout/TableSkeleton";
import { createUserSchema } from "../validation";
import { CreateUser } from "../../auth/types/authType";
import { selectAuth } from "../../auth/authSlice";
import Paging from "../../../components/Layout/Paging";

const defaultUser: CreateUser = {
  email: "",
  clientId: 0,
};

export const Users = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedUser, setSelectedUser] = useState(defaultUser);

  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector(selectSetups);
  const { user } = useAppSelector(selectAuth);
  const { searchText } = useAppSelector(selectPreference);
  const [total, setTotal] = useState(3);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(changePageTitle("Users List"));
    const skipRows = currentPage * rowsPerPage;

    dispatch(
      fetchUsers({
        searchText,
        skip: skipRows,
        take: rowsPerPage,
      })
    );
  }, [dispatch, currentPage, rowsPerPage, searchText]);

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

  const RefreshList = () => {
    const skipRows = currentPage * rowsPerPage;
    dispatch(
      fetchUsers({
        refreshList: "refresh",
        searchText,
        skip: skipRows,
        take: rowsPerPage,
      })
    );
  };
  return (
    <>
      <Helmet>
        <title>Users | Pinna Stock</title>
      </Helmet>

      <Stack
        direction="row"
        justifyContent="space-between"
        justifyItems="center"
      >
        <Tooltip title="Refresh Items List">
          <Button color="secondary" variant="contained" onClick={RefreshList}>
            <Refresh />
          </Button>
        </Tooltip>
        <Tooltip title="Add New Item">
          <Button color="secondary" variant="contained" onClick={ResetFields}>
            <Add />
          </Button>
        </Tooltip>
      </Stack>

      <Accordion sx={{ mt: 1 }} expanded={expanded}>
        <StyledAccordionSummary
          onClick={ToggleAccordion}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Detail</Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
          <Formik
            enableReinitialize={true}
            initialValues={selectedUser as CreateUser}
            validationSchema={createUserSchema}
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              if (user && user.client) {
                values = { ...values, clientId: user.client.id as number };
              }
              dispatch(createUser(values));
            }}
          >
            {(props: FormikProps<CreateUser>) => (
              <Form>
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
              </Form>
            )}
          </Formik>
        </AccordionDetails>
      </Accordion>
      <Grid container justifyContent="flex-start" sx={{ mt: 1 }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>S.No</StyledTableCell>
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
                users.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {currentPage * rowsPerPage + index + 1}
                    </StyledTableCell>
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
                          size="large"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => DeleteUser(row.id as number)}
                          size="large"
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

      <Stack spacing={1}>
        <Paging
          total={total}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
        />
        <Typography variant="h6" component="div">
          Number of Users: {total}
        </Typography>
      </Stack>
    </>
  );
};
