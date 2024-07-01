import { combineReducers } from "redux";
import profileReducer from "./profileSlice";

const rootReducer = combineReducers({
    profile: profileReducer
})

export default rootReducer;