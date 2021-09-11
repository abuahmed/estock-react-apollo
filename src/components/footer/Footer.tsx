import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import useStyles from "./styles";

const Footer = () => {
  var classes = useStyles();
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
          <Link
            href={"https://www.facebook.com/pinnasofts"}
            target={"_blank"}
            className={classes.link}
          >
            <i className="fa fa-facebook"></i>
          </Link>
          <Link
            href={"https://twitter.com/pinnasofts"}
            target={"_blank"}
            className={classes.link}
          >
            <i className="fa fa-twitter"></i>
          </Link>
          <Link
            href={"https://github.com/pinnasofts"}
            target={"_blank"}
            className={classes.link}
          >
            <i className="fa fa-github"></i>
          </Link>
        </div>
      </Box>
    </footer>
  );
};

export default Footer;
