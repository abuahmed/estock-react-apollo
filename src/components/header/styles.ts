import { alpha, makeStyles } from '@material-ui/core/styles'

const drawerWidth = 240

export default makeStyles((theme) => ({
    root: {

        display: 'flex',
        // width: '100%',
        // flexDirection: 'column',
        // height: '100vh',
        // overflow: 'hidden',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        maxHeight: 64,
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: -12,
    },
    hide: {
        display: 'none',
    },
    toolbar: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        ...theme.mixins.toolbar,
    },
    // offlineIndicator: {
    //     position: 'absolute',
    //     display: 'flex',
    //     alignItems: 'center',
    //     backgroundColor: theme.palette.secondary.main,
    //     justifyContent: 'center',
    //     right: 0,
    //     left: 0,
    //     height: (props) => props.offlineIndicatorHeight,
    // },
    content: {
        flex: 1,
        overflow: 'auto',
    },
    grow: {
        flex: '1 1 auto',
    },

    title: {
        fontWeight: 500
        // display: 'none',
        // [theme.breakpoints.up('sm')]: {
        //     display: 'block',
        // },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: 36,
        // [theme.breakpoints.up('sm')]: {
        //     marginLeft: theme.spacing(3),
        //     width: 'auto',
        // },
    },
    searchFocused: {
        backgroundColor: alpha(theme.palette.common.black, 0.08),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: 250,
        },
    },
    searchIcon: {
        width: 36,
        right: 0,
        height: "100%",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: theme.transitions.create("right"),
        "&:hover": {
            cursor: "pointer",
        },

        // padding: theme.spacing(0, 2),
        // height: '100%',
        // position: 'absolute',
        // pointerEvents: 'none',
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    searchIconOpened: {
        right: theme.spacing(1.25),
    },

    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
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

    mobileBackButton: {
        marginTop: theme.spacing(0.5),
        marginLeft: 18,
        [theme.breakpoints.only('sm')]: {
            marginTop: theme.spacing(0.625),
        },
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },




    drawerPaper: {
        width: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 40,
        [theme.breakpoints.down("sm")]: {
            width: drawerWidth,
        },
    },
    drawerHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        //padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        // ...theme.mixins.toolbar,
        justifyContent: 'space-between',
        backgroundColor: theme.palette.primary.main
    },
    avatar: {
        width: '5rem',
        height: '5rem',
    },
    smallAvatar: {
        width: '20px',
        height: '20px',
    },
    drawerHeaderText: {
        color: 'white',
        padding: theme.spacing(0, 1),
    },

    linkText: {
        textDecoration: `none`,
        textTransform: `uppercase`,
        color: `white`,
    },
    headerIcon: {
        fontSize: 28,
        color: 'rgba(255, 255, 255, 0.35)',
    },
    headerIconCollapse: {
        color: 'white',
    },
    headerMenuButtonSandwich: {
        marginLeft: 9,
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0,
        },
        padding: theme.spacing(0.5),
    },
    headerMenuButtonCollapse: {
        marginRight: theme.spacing(2),
    },
    profileMenu: {
        minWidth: 265,
    },
    profileMenuUser: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
    },
    profileMenuItem: {
        color: theme.palette.text.primary,
    },
    profileMenuIcon: {
        marginRight: theme.spacing(2),
        color: theme.palette.text.primary,
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
    profileMenuLink: {
        fontSize: 16,
        textDecoration: 'none',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    headerMenu: {
        marginTop: theme.spacing(7),
    },
    headerMenuList: {
        display: 'flex',
        flexDirection: 'column',
    },
    headerMenuItem: {
        '&:hover, &:focus': {
            backgroundColor: theme.palette.background.default,
            // color: "white",
        },
    },
    headerMenuButton: {
        marginLeft: theme.spacing(2),
        padding: theme.spacing(0.5),
    },
}))