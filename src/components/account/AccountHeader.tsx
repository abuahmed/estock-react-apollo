import React, { ChangeEvent, useState } from "react";
import Avatar from "@mui/material/Avatar";
import {
  updateProfile,
  uploadFile,
  deleteFile,
  selectAuth,
} from "../../features/auth/authSlice";
import Delete from "@mui/icons-material/Delete";
import AddAPhoto from "@mui/icons-material/AddAPhoto";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AuthUser } from "../../features/auth/types/authType";
import { useTheme } from "@mui/material";

function AccountHeader() {
  const [image, setImage] = useState("");
  const theme = useTheme();
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(URL.createObjectURL(event.target.files[0]));

      //let values = me
      //values = { ...values, avatar: `/public/images/${user?.id}.jpg` } as AuthProfile
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        var base64EncodedImage = reader.result;
        dispatch(
          uploadFile(JSON.stringify({ id: user!.id, data: base64EncodedImage }))
        );
      };
      reader.onerror = () => {
        console.log("error uploading image");
      };

      //dispatch(updateProfile(values))
    }
  };

  const removeImage = () => {
    setImage("");
    let prof = user;
    prof = { ...prof, avatar: "" } as AuthUser;
    dispatch(updateProfile(prof));
    dispatch(deleteFile(user?.avatar as string));
  };

  return <>
    <Paper
      elevation={3}
      style={{
        position: "relative",
        borderRadius: 18,
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <input
        name="image"
        accept="image/*"
        onChange={onChange}
        style={{ display: "none" }}
        id="icon-button-file"
        type="file"
      />
      <label htmlFor="icon-button-file">
        <>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <Tooltip title="Change Image" aria-label="icon-button-file">
                <Fab component="span" color="primary">
                  <IconButton aria-label="icon-button-file" component="span" size="large">
                    <AddAPhoto />
                  </IconButton>
                </Fab>
              </Tooltip>
            }
          >
            <Avatar
              alt="avatar"
              src={image ? image : user ? user.avatar : ""}
              sx={{
                height: 200,
                width: 200,
                marginTop: -3,
              }}
            />
          </Badge>
        </>
      </label>{" "}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: 18,
          marginBottom: 18,
          paddingRight: 20,
          paddingLeft: 20,
        }}
      >
        <Typography
          variant="h4"
          style={{
            fontSize: 26,
            fontWeight: "bold",
            textAlign: "center",
          }}
          noWrap
          width="200px"
        >
          {user && user.name}
        </Typography>
        <Typography variant="h6">{user && user.email}</Typography>

        {(image || (user && user.avatar)) && (
          <>
            <Box component="div" pt={3} pb={2}>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                onClick={removeImage}
                sx={{
                  margin: "auto",
                  marginBottom: theme.spacing(2),
                  width: "100%",
                }}
              >
                <Delete /> Delete Image
              </Button>
            </Box>
          </>
        )}
      </div>
    </Paper>
  </>;
}

export default AccountHeader;
