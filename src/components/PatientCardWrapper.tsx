import { Col, Row } from "antd";
import PatientCard from "./PatientCard";
import { rowTopStyle } from "../styles/additionalStyles";

function PatientCardWrapper()
{
    return (<Row gutter={[16, 16]} style={rowTopStyle}>
        <Col xs={24} lg={12}>
            <PatientCard/>
        </Col>
        <Col xs={24} lg={12}>
            <PatientCard/>
        </Col>
        <Col xs={24} lg={12}>
            <PatientCard/>
        </Col>
        <Col xs={24} lg={12}>
            <PatientCard/>
        </Col>
    </Row>);
}

export default PatientCardWrapper;