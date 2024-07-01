import { Flex, Layout } from "antd";
import HeaderMain from "../../components/HeaderMain";
import { loginCardWrapper, styleForWrapperContent } from "../../styles/additionalStyles";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../context/LoginContext";
import ReportsFilterAndTable from "./ReportsFilterAndTable";
import { RootState } from "../../reducers";
import { useSelector } from "react-redux";

const { Content } = Layout;

function Reports()
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
            <Flex style={{...loginCardWrapper}}>
                <Content style={{...styleForWrapperContent}}>
                    <ReportsFilterAndTable/>
                </Content>
            </Flex>
        </>
    )
}

export default Reports;