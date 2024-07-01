import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProfileType } from "../pages/ProfilePage/ProfileCard";
import { baseUrl } from "../const/constValues";
import axios from "axios";


interface ProfileState
{
    profile: ProfileType | null,
    loading: boolean,
    error: any
}

const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null
}

export const fetchData = createAsyncThunk('profile/fetchData', async () => {
    const response = await axios.get(baseUrl + "doctor/profile",
    { 
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem("token")}` 
        } 
    })
    return response.data;
});

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchData.fulfilled, (state, action: PayloadAction<ProfileType>) => {
            state.loading = false;
            state.profile = action.payload;
        })
        .addCase(fetchData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch data';
        })
    },
});

export default profileSlice.reducer;