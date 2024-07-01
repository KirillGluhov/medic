import { useNavigate } from "react-router-dom";
import { useLogin } from "../../context/LoginContext";
import { useEffect } from "react";
import HeaderMain from "../../components/HeaderMain";
import { Flex, Layout } from "antd";
import { loginCardWrapper, styleForWrapperContent } from "../../styles/additionalStyles";
import DetailsInspection from "./DetailsInspection";

const { Header, Footer, Sider, Content } = Layout;

function Inspection()
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
                <Content style={styleForWrapperContent}>
                    <DetailsInspection/>
                </Content>
            </Flex>
        </>
    )
}

export default Inspection;