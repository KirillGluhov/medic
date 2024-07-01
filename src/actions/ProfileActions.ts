
import { Dispatch } from "redux";
import { ProfileType } from "../pages/ProfilePage/ProfileCard";
import axios from "axios";
import { baseUrl } from "../const/constValues";

export const SET_PROFILE = 'SET_PROFILE';
export const FETCH_PROFILE = 'FETCH_PROFILE';
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
export const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';

export const setCurrentProfile = (currentProfile: ProfileType) => ({
    type: SET_PROFILE,
    payload: currentProfile
})

export const fetchProfileRequest = () => ({
    type: FETCH_PROFILE,
});
  
export const fetchProfileSuccess = (currentProfile: ProfileType) => ({
    type: FETCH_PROFILE_SUCCESS,
    payload: currentProfile,
});
  
export const fetchProfileFailure = (error: any) => ({
    type: FETCH_PROFILE_FAILURE,
    payload: error,
});

export const fetchProfile = () => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchProfileRequest());
        try
        {
            const response = await axios.get(baseUrl + "doctor/profile", 
                { 
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem("token")}` 
                    } 
                }
            )
            const data = await response.data;
            dispatch(fetchProfileSuccess(data));
        }
        catch (error)
        {
            dispatch(fetchProfileFailure(error))
        }
    }
}
