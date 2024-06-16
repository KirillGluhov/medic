import { Button, Col, Flex, Pagination, Row, Typography } from "antd";
import FilterCard from "./FilterCard";
import PatientCardWrapper from "./PatientCardWrapper";
import { 
    contentWrapper, 
    stylePatientAdd, 
    patientTitleTop,
    boldText,
    cardButtonStyle,
    cardSizeStyle,
    patientTopSizeStyle,
    userAddIconStyle,
    flexCentered
} from "../styles/additionalStyles";

import { UserAddOutlined } from "@ant-design/icons";
import PageList from "./PageList";

const {Paragraph, Title} = Typography;

function MainPartOfPatients()
{
    return <Flex style={contentWrapper}>
    <Row style={stylePatientAdd}>
        <Title style={patientTitleTop}>Пациенты</Title>
        <Button
        htmlType='submit' 
        type='primary'
        style={
            {
                ...patientTopSizeStyle, 
                ...cardButtonStyle, 
                ...boldText
            }
        }>
            <UserAddOutlined style={userAddIconStyle}/>Регистрация нового пациента
        </Button>
    </Row>
    <Flex>
        <FilterCard/>
    </Flex>
    <Flex>
        <PatientCardWrapper/>
    </Flex>
    <Flex style={flexCentered}>
        <PageList/>
    </Flex>
    </Flex>;
}

export default MainPartOfPatients;