import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    card: {
        maxWidth: 400,
        margin: 'auto',
        textAlign: 'center',
        //marginTop: theme.spacing(12),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
    error: {
        verticalAlign: 'middle',
        color: 'red',
        margin: 0,
    },
    title: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        //color: theme.palette.openTitle,
    },
    textField: {
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
        width: '100%',
    },
    submit: {
        margin: 'auto',
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    signup: {
        paddingLeft: theme.spacing(0.5),
    },
    label: {
        marginBottom: theme.spacing(0),
    },

}))