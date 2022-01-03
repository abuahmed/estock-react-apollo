import React from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>Home | Pinna Stock</title>
      </Helmet>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h2>Landing Page</h2>

        <div>
          <NavLink to="/app">Dashboard</NavLink>
        </div>
      </div>
    </>
  );
};
export default LandingPage;
