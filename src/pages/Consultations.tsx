import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import { useEffect } from "react";
import HeaderMain from "../components/HeaderMain";
import { Flex, Layout } from "antd";
import { loginCardWrapper, styleForWrapperContent } from "../styles/additionalStyles";
import CardCurrentPatient from "../components/CardCurrentPatient";
import ConsultationCard from "../components/ConsultationCard";

const { Header, Footer, Sider, Content } = Layout;

function Consultations()
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
                    <ConsultationCard/>
                </Content>
            </Flex>
        </>
    )
}

export default Consultations;