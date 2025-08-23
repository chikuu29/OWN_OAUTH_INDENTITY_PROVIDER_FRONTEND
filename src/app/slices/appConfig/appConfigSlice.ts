import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GETAPI } from '../../api';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { APP_CONFIG_STATE } from '../../../app/interfaces/app.interface';
import { startLoading, stopLoading } from '../loader/appLoaderSlice';

export const fetchAppConfig = createAsyncThunk(
  'app/fetchAppConfig',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Start the loading process before making the API call
      dispatch(startLoading('Fetching app configuration...'));

      const response = await firstValueFrom(
        GETAPI({
          path: 'app/app-configuration',
          isPrivateApi: true,
          enableCache: true,
          cacheTTL:300
        }).pipe(
          map((res: any) => {
            if (res.success) {
              return res['result'];
            } else {
              throw new Error('Failed to fetch app configuration');
            }
          }),
          catchError((error: any) => {
            return throwError(() => new Error(error.message || 'Failed to fetch app configuration'));
          })
        )
      );

      return response;
    } catch (error:any) {
      return rejectWithValue(error.message);
    } finally {
      // Stop the loading process after the API call completes
      dispatch(stopLoading());
    }
  }
);

interface AppConfig {
  appConfig: any;
  AppConfigState: APP_CONFIG_STATE;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed' | 'loading';
  error: any;
}

const initialState: AppConfig = {
  AppConfigState: {
    FEATURE: [],
    DISPLAY_TYPE: {
      SHOW_TOP_NAV_MENU: false,
      SHOW_SIDE_NAV_MENU: false,
    },
  },
  appConfig: {
    config: {
      appList: [
          {
            id: "ADMIN_MODULES",
            hidden: false,
            name: "Admin Module",
            target: "/home?app=AdminModules",
            actions: {
              onClick: "",
            },
            logo: {
              url: "../assets/icons/3d-casual-life-secure-document.png",
              style: {
                mb: "4px",
                boxSize: "59px",
                objectFit: "contain",
              },
            },
          },
          {
            id: "MYOMSSYSTEM",
            hidden: false,
            name: "OMS SYSTEM",
            target: "/MyOMS?app=MyOMS",
            actions: {
              onClick: "",
            },
            logo: {
              url: "../assets/icons/rainbow-online-store.png",
              style: {
                mb: "4px",
                boxSize: "59px",
                objectFit: "contain",
              },
            },
          },
          {
            id: "MY_GYM",
            hidden: false,
            name: "MY GYM",
            target: "/GymView?app=myGym",
            actions: {
              onClick: "",
            },
            logo: {
              url: "../assets/icons/smart-gym-water-bottle-and-dumbbells-for-a-healthy-lifestyle.png",
              style: {
                mb: "4px",
                boxSize: "59px",
                objectFit: "contain",
              },
            },
          },
          {
            id: "AI_CHAT_BOT",
            hidden: false,
            name: "AI CHATBOT",
            target: "/c?app=AI",
            actions: {
              onClick: "",
            },
            logo: {
              url: "../assets/icons/3d-casual-life-small-chatbot-with-magnifying-glass.png",
              style: {
                mb: "4px",
                boxSize: "59px",
                objectFit: "contain",
              },
            },
          }
         
        ],
      featueListBaseOnURL: {},
    },
  },
  loading: 'idle',
  error: null,
};

const appConfigSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    SET_APP_CONFIG_STATE: (state, action: PayloadAction<APP_CONFIG_STATE>) => {
      state.AppConfigState = { ...state.AppConfigState, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppConfig.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchAppConfig.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.appConfig = action.payload;
      })
      .addCase(fetchAppConfig.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.error.message;
      });
  },
});

export const { SET_APP_CONFIG_STATE } = appConfigSlice.actions;
export default appConfigSlice.reducer;
