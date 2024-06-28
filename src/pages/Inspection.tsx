import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import { useEffect } from "react";
import HeaderMain from "../components/HeaderMain";
import { Flex, Layout } from "antd";
import { loginCardWrapper, styleForWrapperContent } from "../styles/additionalStyles";
import CardCurrentPatient from "../components/CardCurrentPatient";
import { usePatientAndInspection } from "../context/PatientAndInspectionContext";
import CreationInspectionFormWrapper from "../components/CreationInspectionFormWrapper";
import DetailsInspection from "../components/DetailsInspection";

const { Header, Footer, Sider, Content } = Layout;

function Inspection()
{
    const {isLogin, setIsLogin} = useLogin();
    const navigate = useNavigate();
    const {Inspection, setInspection} = usePatientAndInspection();
    
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