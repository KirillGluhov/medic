import { SET_IS_LOGIN } from "../actions/LoginActions";

interface LoginState
{
    isLogin: boolean | null
}

const initialState: LoginState = {
    isLogin: null
}

const loginReducer = (state = initialState, action: any): LoginState => {
    switch (action.type) {
        case SET_IS_LOGIN:
            return {
                ...state,
                isLogin: action.payload
            }
        default:
            return state;
    }
}

export default loginReducer;