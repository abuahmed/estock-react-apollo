import React, { ReactNode, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  handleDialogClose: Function;
}
function CustomDialog({ children, isOpen, title, handleDialogClose }: Props) {
  const [open, setOpen] = React.useState(isOpen);
  const { success } = useAppSelector(selectAuth);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    handleDialogClose();
  };

  if (success) {
    handleClose();
  }

  return (
    <Dialog
      title={title}
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          height: 60,
        }}
      >
        {handleClose ? (
          <>
            {title}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[200],
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </>
        ) : null}
      </DialogTitle>
      {children}
    </Dialog>
  );
}

export default CustomDialog;
