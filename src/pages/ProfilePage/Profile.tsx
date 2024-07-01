import { Flex } from "antd";
import HeaderMain from "../../components/HeaderMain";
import { loginCardWrapper } from "../../styles/additionalStyles";
import ProfileCard from "./ProfileCard";
import { useLogin } from "../../context/LoginContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile()
{
    const {isLogin, setIsLogin} = useLogin();
    //const isLogin = useSelector((state: RootState) => state.isLogin.isLogin);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isLogin === null)
        {
            navigate("/login/");
        }
    }, [isLogin])

    return (
        <>
            <HeaderMain/>
            <Flex style={loginCardWrapper}>
                <ProfileCard/>
            </Flex>
        </>
    )
}

export default Profile;