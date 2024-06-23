import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import { useEffect } from "react";
import HeaderMain from "../components/HeaderMain";
import { Flex, Layout } from "antd";
import { loginCardWrapper, styleForWrapperContent } from "../styles/additionalStyles";
import CardCurrentPatient from "../components/CardCurrentPatient";
import { usePatientAndInspection } from "../context/PatientAndInspectionContext";
import CreationInspectionFormWrapper from "../components/CreationInspectionFormWrapper";

const { Header, Footer, Sider, Content } = Layout;

function CreationOfInspections()
{
    const {isLogin, setIsLogin} = useLogin();
    const navigate = useNavigate();
    const {Patient, setPatient, Inspection, setInspection} = usePatientAndInspection();
    
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
                    <CreationInspectionFormWrapper/>
                </Content>
            </Flex>
        </>
    )
}

export default CreationOfInspections;