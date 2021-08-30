import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
    card: {
        margin: '32px 0px',
        //marginTop: theme.spacing(12),
        padding: '16px 40px 90px 40px',
        backgroundColor: '#80808017',
    },
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        marginTop: theme.spacing(6),
    },
    title: {
        margin: '0 16px 8px 0px',
        color: 'rgba(88, 114, 128, 0.87)',
        fontWeight: 'bold',
        //color: theme.palette.openTitle,
    },
    subheading: {
        marginBottom: '20px',
    },
    error: {
        verticalAlign: 'middle',
        color: 'red',
        margin: 0,
    },

    textField: {
        width: '100%',
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2),
        width: '100%',
    },
    buttonText: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    buttonIcon: {
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'block',
        },
    },
    fab: {
        // margin: theme.spacing(2),
    },
    removeButton: {
        marginLeft: theme.spacing(1)
    },
    bigAvatar: {
        width: 200,
        height: 200,
        objectFit: 'cover',
        // margin: 'auto',
    },
    avatar: {
        width: '10rem',
        height: '10rem',
        marginTop: '-1rem',
    },
    toolBar: {
        ...theme.mixins.toolbar
    },
    input: {
        display: 'none',
    },
    filename: {
        marginLeft: '10px',
    },
}))