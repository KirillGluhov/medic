import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FETCH_PROFILE, FETCH_PROFILE_FAILURE, FETCH_PROFILE_SUCCESS, SET_PROFILE } from "../actions/ProfileActions";
import { ProfileType } from "../pages/ProfilePage/ProfileCard";
import { baseUrl } from "../const/constValues";
import axios from "axios";
import { Specialty } from "../pages/InspectionCreatePage/Consultations";


interface ProfileState
{
    specialities: Specialty[] | null,
    loading: boolean,
    error: any
}

const initialState: ProfileState = {
    specialities: null,
    loading: false,
    error: null
}

export const fetchData = createAsyncThunk('profile/fetchData', async () => {
    const response = await axios.get(baseUrl + "dictionary/speciality", {
        params: {
          page: 1,
          size: 100
        }
    })
    return response.data;
});

const profileSlice = createSlice({
    name: 'specialities',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchData.fulfilled, (state, action: PayloadAction<Specialty[]>) => {
            state.loading = false;
            state.specialities = action.payload;
        })
        .addCase(fetchData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch data';
        })
    },
});

export default profileSlice.reducer;