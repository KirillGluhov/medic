import { Col, Row } from "antd";
import PatientCard from "./PatientCard";
import { rowTopStyle, width100 } from "../styles/additionalStyles";

export interface Patient
{
    birthday?: string;
    createTime: string;
    gender: string;
    id: string;
    name: string;
}

interface PatientsCardWrapperProps
{
    patients: Patient[];
}

const PatientCardWrapper: React.FC<PatientsCardWrapperProps> = ({patients}) =>
{
    return (<Row gutter={[16, 16]} style={{...rowTopStyle, ...width100}}>
        {
            Array.from(patients).map((patient) => (
                <Col xs={24} lg={12} key={patient.id}>
                    <PatientCard patient={patient}/>
                </Col>
            ))
        }
    </Row>);
}

export default PatientCardWrapper;

/*

Array.from(files).map((file, index) => (
                <CardMusic 
                file={file} 
                index={index}
                />
            ))

*/