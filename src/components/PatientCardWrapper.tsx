import { Col, Empty, Row, Typography } from "antd";
import PatientCard from "./PatientCard";
import { cardTitle, patientFlexCentered, rowTopStyle, width100 } from "../styles/additionalStyles";

export interface Patient
{
    birthday?: string;
    createTime: string;
    gender: string;
    id: string;
    name: string;
}

export interface Page
{
    count: number,
    current: number,
    size: number
}

interface PatientsCardWrapperProps
{
    patients: Patient[];
    pageInfo: Page | null;
}

const PatientCardWrapper: React.FC<PatientsCardWrapperProps> = ({patients, pageInfo}) =>
{
    return (<Row gutter={[16, 16]} style={{...rowTopStyle, ...width100, ...patientFlexCentered}}>
        {
            patients.length > 0 ?
            Array.from(patients).map((patient) => (
                <Col xs={24} lg={12} key={patient.id}>
                    <PatientCard patient={patient} />
                </Col>
            )) : pageInfo ? <Empty description={
                <Typography style={cardTitle}>Нет пациентов, подходящих под критерии</Typography>
              }/> : <Empty description={
                <Typography style={cardTitle}>Страницы с таким номером нет</Typography>
              }/>
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