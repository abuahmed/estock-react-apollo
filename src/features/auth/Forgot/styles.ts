import { makeStyles } from '@material-ui/core/styles'
import blueGrey from '@material-ui/core/colors/blueGrey';

export default makeStyles((theme) => ({
    card: {
        maxWidth: 400,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2),
    },
    error: {
        verticalAlign: 'middle',
    },
    divider: {
        marginBottom: theme.spacing(3),
    },
    title: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        color: blueGrey['400'],
    },
    textField: {
        color: blueGrey['400'],
        width: '100%',
    },
    submit: {
        margin: 'auto',
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    navDisplayFlex: {
        display: `flex`,
        justifyContent: `space-between`,
        alignItems: 'center',
    },
    forgot: {
        marginTop: theme.spacing(-1),
    },
    signUp: {
        paddingLeft: theme.spacing(0.5),
    },
    label: {
        marginBottom: theme.spacing(0),
    },
}));