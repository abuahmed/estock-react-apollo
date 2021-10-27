import React from "react";
import GoogleLogin from "react-google-login";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useAppDispatch } from "../../app/hooks";
import { google } from "./authSlice";

const Google = () => {
  const dispatch = useAppDispatch();

  const responseGoogle = (response) => {
    dispatch(google({ idToken: response.tokenId }));
  };
  const failResponseGoogle = (response) => {
    //dispatch(google({ idToken: response.tokenId }));
  };
  return (
    <Box pb={2}>
      <GoogleLogin
        clientId="287014686210-l0hlb5hjd8dg45o9cjpebalgn80dmde2.apps.googleusercontent.com"
        onSuccess={responseGoogle}
        onFailure={failResponseGoogle}
        autoLoad={false}
        render={(renderProps) => (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "rgb(220, 0, 78)",
              color: "white",
              width: "100%",
              display: "block",
            }}
            onClick={renderProps.onClick}
          >
            <i className="fa fa-google pr-2"></i> Login with Google
          </Button>
        )}
        cookiePolicy={"single_host_origin"}
      />
    </Box>
  );
};

export default Google;
