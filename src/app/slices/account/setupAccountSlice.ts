

import { createSlice } from '@reduxjs/toolkit'
import { validate } from 'uuid'

const initialState = {
    validationsPassed: false,
    validatedAccountsData: {} as any,
}


const setupAccountSlice = createSlice({
    name: 'setup_account',
    initialState,
    reducers: {
        setValidatedAccountsData: (state, action) => {
            const { validatedAccountsData, validationsPassed } = action.payload;
            state.validatedAccountsData = validatedAccountsData;
            state.validationsPassed = validationsPassed;
        }
        // setStep: (state, action) => {
        //   state.step = action.payload
        // },
        // completeStep: (state, action) => {
        //   state.completedSteps.push(action.payload)
        // },
    },
})

export const { setValidatedAccountsData } = setupAccountSlice.actions
export default setupAccountSlice.reducer