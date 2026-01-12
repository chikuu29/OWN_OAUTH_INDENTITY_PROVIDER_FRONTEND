import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/auth/authSlice'
import appConfigSlice from './slices/appConfig/appConfigSlice'
// import { loadState, saveState } from '../utils/app/localStorageUtils'
import appLoaderSlice from './slices/loader/appLoaderSlice'
// import appLoaderSlice from './slices/loader/appLoaderSlice'
import onboardingSlice from './slices/account/onboardingSlice'
import errorReducer from './slices/errorSlice';


// const preLoadedState=loadState('app_config')

export const store = configureStore({
    reducer: {
        auth: authSlice,
        app: appConfigSlice,
        loader: appLoaderSlice,
        onboarding: onboardingSlice,
        error: errorReducer
    },
    // preloadedState:{
    //     appConfig:preLoadedState?.appConfig ||{}
    // }

})
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// store.subscribe(()=>{
//     console.log("Store subscribe",store.getState().appConfig);
//     saveState('app_config',store.getState().appConfig);
// })

// {
//     reducer: {
//         posts:postsReducer,
//         comments:commentsReducer,
//         users:usersReducer
//     }
// }