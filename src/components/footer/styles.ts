import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(theme => ({
    link: {
        color: 'black',
        '&:hover': {
            textDecoration: 'none',
        },
        '&:not(:first-child)': {
            paddingLeft: 15
        }
    }
}));