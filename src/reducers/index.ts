import { combineReducers } from "redux";
import patientReducer from "./patientReducer";

const rootReducer = combineReducers({
    patient: patientReducer
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>