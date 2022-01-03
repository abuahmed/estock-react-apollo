import React from "react";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useTheme } from "@mui/material";
import { Box } from "@mui/material";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Severity = "error" | "success" | "info" | "warning" | undefined;

interface Props {
  severity: Severity;
  children: string;
}
export interface State extends SnackbarOrigin {
  open: boolean;
}

export default function Toast({ severity, children }: Props) {
  const theme = useTheme();
  //const [open, setOpen] = React.useState(true);
  const [state, setState] = React.useState<State>({
    open: true,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClose = (
    event: Event | React.SyntheticEvent<any, Event>,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    //setOpen(false);
    setState({ ...state, open: false });
  };

  return (
    <Box
      sx={{
        width: "100%",
        "& > * + *": {
          marginTop: theme.spacing(2),
        },
      }}
    >
      <Snackbar
        open={open}
        autoHideDuration={6000}
        resumeHideDuration={0}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {children}
        </Alert>
      </Snackbar>
    </Box>
  );
}
