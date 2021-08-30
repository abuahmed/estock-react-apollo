import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    card: {
        maxWidth: 400,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2),
        backgroundColor: theme.palette.background.paper
    },
    error: {
        verticalAlign: 'middle',
    },
    divider: {
        marginBottom: theme.spacing(3),
    },
    submit: {
        margin: 'auto',
        width: '100%',
        marginBottom: theme.spacing(2),
    },
}));