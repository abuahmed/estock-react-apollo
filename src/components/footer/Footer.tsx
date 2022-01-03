import Box from "@mui/material/Box";
import { StyledLink } from "../../styles/componentStyled";
const Footer = () => {
  return (
    <footer>
      <Box
        mt={1}
        px={2}
        width={"100%"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <div>
          <StyledLink
            href={"https://www.facebook.com/pinnasofts"}
            target={"_blank"}
          >
            <i className="fa fa-facebook"></i>
          </StyledLink>
          <StyledLink href={"https://twitter.com/pinnasofts"} target={"_blank"}>
            <i className="fa fa-twitter"></i>
          </StyledLink>
          <StyledLink href={"https://github.com/pinnasofts"} target={"_blank"}>
            <i className="fa fa-github"></i>
          </StyledLink>
        </div>
      </Box>
    </footer>
  );
};

export default Footer;
