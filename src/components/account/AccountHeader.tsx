import React, { ChangeEvent, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import {
  updateProfile,
  uploadFile,
  deleteFile,
  selectAuth,
} from "../../features/auth/authSlice";
import Delete from "@material-ui/icons/Delete";
import AddAPhoto from "@material-ui/icons/AddAPhoto";

import Typography from "@material-ui/core/Typography";
import useStyles from "./styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import Badge from "@material-ui/core/Badge";
import Paper from "@material-ui/core/Paper";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { AuthProfile } from "../../features/auth/types/authType";

function AccountHeader() {
  const classes = useStyles();
  const [image, setImage] = useState("");

  const { user, me } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(URL.createObjectURL(event.target.files[0]));

      //let values = me
      //values = { ...values, avatar: `/public/images/${user?._id}.jpg` } as AuthProfile
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        var base64EncodedImage = reader.result;
        dispatch(
          uploadFile(
            JSON.stringify({ id: user!._id, data: base64EncodedImage })
          )
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
    let prof = me;
    prof = { ...prof, avatar: "" } as AuthProfile;
    dispatch(updateProfile(prof));
    dispatch(deleteFile(me?.avatar as string));
  };

  return (
    <>
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
          className={classes.input}
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
                  <Fab component="span" color="primary" className={classes.fab}>
                    <IconButton aria-label="icon-button-file" component="span">
                      <AddAPhoto />
                    </IconButton>
                  </Fab>
                </Tooltip>
              }
            >
              <Avatar
                alt="avatar"
                src={image ? image : me ? me.avatar : ""}
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
            {me && me.name}
          </Typography>
          <Typography variant="h6">{me && me.email}</Typography>

          {(image || (me && me.avatar)) && (
            <>
              <Box component="div" pt={3} pb={2}>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  onClick={removeImage}
                  className={classes.submit}
                >
                  <Delete /> Delete Image
                </Button>
              </Box>
            </>
          )}
        </div>
      </Paper>
    </>
  );
}

export default AccountHeader;
