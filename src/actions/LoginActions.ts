export const SET_IS_LOGIN = 'SET_IS_LOGIN';

export const setIsLogin = (isLogin: boolean) => ({
    type: SET_IS_LOGIN,
    payload: isLogin
})