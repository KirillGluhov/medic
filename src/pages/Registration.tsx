import { Flex } from "antd";
import HeaderMain from "../components/HeaderMain";
import LoginCard from "../components/LoginCard";
import { loginCardWrapper } from "../styles/additionalStyles";
import RegistrationCard from "../components/RegistrationCard";

function Registration()
{
    return (
        <>
            <HeaderMain/>
            <Flex style={loginCardWrapper}>
                <RegistrationCard/>
            </Flex>
        </>
    )
}

export default Registration;