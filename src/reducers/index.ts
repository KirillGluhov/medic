import { combineReducers } from "redux";
import loginReducer from "./loginReducer";

const rootReducer = combineReducers({
    isLogin: loginReducer
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>