// import useMediaQuery from "@material-ui/core/useMediaQuery";
// import { TrendingUpRounded } from "@material-ui/icons";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type SettingsState = {
    isDesktop: boolean;
    isDrawerOpen: boolean,
    isMobileDrawerOpen: boolean,
    isMiniMode: boolean,
    pageTitle: string,
    searchText: string | undefined
}

const initialState: SettingsState = {
    isDesktop: true,
    isDrawerOpen: false,
    isMiniMode: false,
    isMobileDrawerOpen: false,
    pageTitle: 'Dashboard',
    searchText: undefined
}
// function checkIsDesktop() {
//     return useMediaQuery('(min-width:600px)')
// }
export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleThis: (state, { payload }) => {
            switch (payload.type) {
                case 'Drawer':
                    state.isDrawerOpen = payload.newValue
                    break;
                case 'Mini':
                    state.isMiniMode = payload.newValue
                    localStorage.setItem('miniMode', payload.newValue)
                    break;
                case 'Mobile':
                    state.isMobileDrawerOpen = payload.newValue
                    break;
            }
        },
        // setIsDesktop: (state, { payload }) => {
        //     state.isDesktop = payload
        // },
        setSearchText: (state, { payload }) => {
            state.searchText = payload
            localStorage.setItem('searchText', payload)
        },
        // toggleMiniDrawer: (state) => {
        //     state.isMiniMode = !state.isMiniMode
        // },
        // toggleMobileDrawer: (state) => {
        //     state.isMobileDrawerOpen = !state.isMobileDrawerOpen
        // },
        changePageTitle: (state, { payload }) => {
            state.pageTitle = payload
        },

    },
    extraReducers: {}
})

export const { toggleThis, changePageTitle, setSearchText } = settingsSlice.actions

export const selectSetting = (state: RootState) => state.settings as SettingsState;

export default settingsSlice.reducer