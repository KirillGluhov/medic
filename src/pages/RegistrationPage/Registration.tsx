import { Flex } from "antd";
import HeaderMain from "../../components/HeaderMain";
import { loginCardWrapper } from "../../styles/additionalStyles";
import RegistrationCard from "./RegistrationCard";

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