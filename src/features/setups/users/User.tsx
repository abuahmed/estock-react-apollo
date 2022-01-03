import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { NavLink as RouterLink, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import { StyledAccordionSummary } from "../../../styles/componentStyled";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { Backspace } from "@mui/icons-material";

import Toast from "../../../components/Layout/Toast";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchRoles, getUser, setWarehouses } from "../setupSlices";
import { changePageTitle } from "../../preferences/preferencesSlice";
import { selectSetups } from "../setupSlices";
import { UserWarehouses } from "./components/UserWarehouses";
import { UserRoles } from "./components/UserRoles";
import { selectAuth } from "../../auth/authSlice";

export const User = () => {
  const { id: userId } = useParams() as {
    id: string;
  };
  const { user } = useAppSelector(selectAuth);

  const { selectedUser, roles, warehouses, error } =
    useAppSelector(selectSetups);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changePageTitle(`Manage User`));
    dispatch(fetchRoles("all"));
    if (user?.id) dispatch(setWarehouses(user?.warehouses));
  }, [dispatch, user]);

  useEffect(() => {
    if (userId && warehouses.length > 0 && roles.length > 0) {
      dispatch(getUser(parseInt(userId)));
    }
  }, [dispatch, userId, warehouses, roles]);

  return (
    <>
      <Helmet>
        <title> {`${selectedUser?.name?.toUpperCase()} Roles`}</title>
      </Helmet>
      <Box m={1} px={2}>
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={"/app/users"}
        >
          <Backspace />
        </Button>
        <Divider variant="middle" sx={{ my: 2 }} />

        <Accordion sx={{ my: 1 }}>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" component="div">
              User Info
            </Typography>
          </StyledAccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  id="nameId"
                  label="Name"
                  value={selectedUser?.name as string}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1, textTransform: "uppercase" }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  id="emailId"
                  label="Email"
                  value={selectedUser?.email as string}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1, textTransform: "uppercase" }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ my: 1 }}>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" component="div">
              Warehouses
            </Typography>
          </StyledAccordionSummary>
          <AccordionDetails>
            <UserWarehouses userId={parseInt(userId)} />
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ my: 1 }}>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" component="div">
              Roles
            </Typography>
          </StyledAccordionSummary>
          <AccordionDetails>
            <UserRoles userId={parseInt(userId)} />
          </AccordionDetails>
        </Accordion>

        {error && <Toast severity="error">{error.message}</Toast>}
      </Box>
    </>
  );
};
