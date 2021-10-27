import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { useAppDispatch } from "../../app/hooks";
import { facebook } from "./authSlice";

const Facebook = () => {
  const dispatch = useAppDispatch();

  const responseFacebook = (response) => {
    dispatch(
      facebook({ userID: response.userID, accessToken: response.accessToken })
    );
  };
  return (
    <Box pb={2}>
      <FacebookLogin
        appId="148914567116248"
        autoLoad={false}
        callback={responseFacebook}
        render={(renderProps) => (
          <Button
            variant="contained"
            onClick={renderProps.onClick}
            sx={{
              backgroundColor: "#3b5998",
              color: "white",
              width: "100%",
              display: "block",
            }}
          >
            <i className="fa fa-facebook pr-2"></i> Login with Facebook
          </Button>
        )}
      />
    </Box>
  );
};

export default Facebook;
