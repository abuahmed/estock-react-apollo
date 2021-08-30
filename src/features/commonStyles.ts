import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
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
    },

    formDividerContainer: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        display: 'flex',
        alignItems: 'center',
    },
    formDividerWord: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    formDivider: {
        flexGrow: 1,
        height: 1,
        backgroundColor: theme.palette.text.primary + '40',
    },
    divider: {
        marginBottom: theme.spacing(3),
    },
    greeting: {
        fontWeight: 500,
        textAlign: 'center',
        //marginTop: theme.spacing(4),
    },
    subGreeting: {
        //fontWeight: 400,
        textAlign: "center",
        marginTop: theme.spacing(2),
    },
}))

