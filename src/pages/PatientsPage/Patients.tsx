import { Flex, Layout } from "antd";
import HeaderMain from "../../components/HeaderMain";
import { 
    loginCardWrapper, 
    styleForWrapperContent 
} from "../../styles/additionalStyles";
import { useLogin } from "../../context/LoginContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainPartOfPatients from "./MainPartOfPatients";

const { Content } = Layout;

function Patients()
{
    const {isLogin, setIsLogin} = useLogin();
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
                <Content style={styleForWrapperContent}>
                    <MainPartOfPatients/>
                </Content>
            </Flex>
        </>
    )
}

export default Patients;