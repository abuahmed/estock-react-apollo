import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { NavLink as RouterLink, useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import { Button, Divider, TextField, Typography } from "@material-ui/core";
import { Backspace } from "@material-ui/icons";

import Toast from "../../components/Layout/Toast";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchRoles, getUser, selectUsers } from "./usersSlice";
import { changePageTitle } from "../settings/settingsSlice";
import { fetchWarehouses, selectSetups } from "../setups/setupSlices";
import { UserWarehouses } from "./components/UserWarehouses";
import { UserRoles } from "./components/UserRoles";

export const User = () => {
  const { id: userId } = useParams() as {
    id: string;
  };

  const { selectedUser, error } = useAppSelector(selectUsers);
  const { warehouses } = useAppSelector(selectSetups);
  const { roles } = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changePageTitle(`Manage User`));
    dispatch(fetchRoles("all"));
    dispatch(fetchWarehouses({ parent: "Organization", parentId: 2 }));
  }, [dispatch]);

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
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Backspace /> back to users list
          </Typography>
        </Button>
        <Divider variant="middle" sx={{ my: 2 }} />

        <Accordion sx={{ my: 1 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" component="div">
              User Info
            </Typography>
          </AccordionSummary>
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
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" component="div">
              Assign Warehouses
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UserWarehouses userId={parseInt(userId)} />
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ my: 1 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" component="div">
              Assign Roles
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UserRoles userId={parseInt(userId)} />
          </AccordionDetails>
        </Accordion>

        {error && <Toast severity="error">{error.message}</Toast>}
      </Box>
    </>
  );
};
