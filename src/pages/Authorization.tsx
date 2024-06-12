import { Flex } from "antd";
import HeaderMain from "../components/HeaderMain";
import LoginCard from "../components/LoginCard";
import { loginCardWrapper } from "../styles/additionalStyles";

function Authorization()
{
    return (
        <>
            <HeaderMain/>
            <Flex style={loginCardWrapper}>
                <LoginCard/>
            </Flex>
        </>
    )
}

export default Authorization;