import { Flex, Typography, Form, Row, Col, Empty, FormProps, message } from "antd";
import { 
    cardTitle, 
    contentWrapper,
    titleInspectionStyle
} from "../../styles/additionalStyles";
import SaveOrDelete from "./SaveOrDelete";
import Complaints from "./Complaints";
import Anamnesis from "./Anamnesis";
import DateOfInspectionAndInfoAboutPreviuos from "./DateOfInspectionAndInfoAboutPreviuos";
import Treatment from "./Treatment";
import Consultations from "./Consultations";
import Conclusion from "./Conclusion";
import Diagnosis from "./Diagnosis";
import { useEffect, useState } from "react";
import { Dayjs } from 'dayjs';
import { collectDiagnoses, collectConsultations } from "../../functions/smallFunctions";
import axios from "axios";
import { baseUrl } from "../../const/constValues";
import { useNavigate } from "react-router-dom";

export type Consultation = {
    specialityId: string,
    comment: string
}

export type Diagnoses = {
    icdDiagnosisId: string,
    description?: string,
    type: "Main" | "Concomitant" | "Complication"
}

type InspectionCreate =
{
    date: Dayjs,
    anamnesis: string,
    complaints: string,
    treatment: string,
    conclusion: 'Disease' | 'Recovery' | 'Death',
    nextVisitDate?: Dayjs,
    deathDate?: Dayjs,
    previousInspectionId?: string,
    consultations?: Consultation[],
    diagnoses: Diagnoses[],

    isRequireConsultation: boolean,
    isRepeatInspection: boolean,

    specialityIdFirst?: string,
    commentFirst?: string,

    icdDiagnosisIdFirst: string,
    descriptionFirst?: string,
    typeFirst: "Main" | "Concomitant" | "Complication"
}

function CreationInspectionFormWrapper()
{
    const [form] = Form.useForm();
    const [isHaveDeath, setIsHaveDeath] = useState(false);

    const navigate = useNavigate();
    
    const [Patient, setPatient] = useState(() => {
        return localStorage.getItem("patient") || ''
    })

    useEffect(() => {
        axios.get(baseUrl + `patient/${localStorage.getItem("patient")}/inspections?grouped=true&page=1&size=1`, 
        { 
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem("token")}` 
            } 
        })
        .then(response => {
            console.log(response);
            (
                response.data 
                && response.data.inspections 
                && response.data.inspections[0] 
                && response.data.inspections[0].conclusion 
                && response.data.inspections[0].conclusion === "Death"
            ) 
                ? setIsHaveDeath(true) 
                : setIsHaveDeath(false)
        })
        .catch(error => {
            console.log(error);
        })
    })

    const onFinish: FormProps<InspectionCreate>['onFinish'] = (values) => {
        console.log('Success:', values);

        const data = {
            date: values.date.toISOString(),
            anamnesis: values.anamnesis,
            complaints: values.complaints,
            treatment: values.treatment,
            conclusion: values.conclusion,
            nextVisitDate: (values.nextVisitDate) ? values.nextVisitDate.toISOString() : null,
            deathDate: (values.deathDate) ? values.deathDate.toISOString() : null,
            previousInspectionId: (values.previousInspectionId) ? values.previousInspectionId : null,
            diagnoses: collectDiagnoses(values.diagnoses, values.icdDiagnosisIdFirst, values.descriptionFirst, values.typeFirst),
            consultations: collectConsultations(values.consultations, values.specialityIdFirst, values.commentFirst)
        }

        console.log("Данные:", data);

        axios.post(baseUrl + `patient/${Patient}/inspections`, data, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            navigate(`/patient/${Patient}/`);
            
        })
        .catch(error => {
            console.log(error);
            message.error("Не удалось сохранить осмотр");
        })
    };

    const onFinishFailed: FormProps<InspectionCreate>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (<Flex style={{...contentWrapper}}>
        <Typography.Title style={{...cardTitle, ...titleInspectionStyle}}>Создание осмотра</Typography.Title>
        {(Patient && !isHaveDeath) ? 
        <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            requiredMark={false}
        >
            <Row gutter={[16,16]}>
                <Col span={24}>
                    <DateOfInspectionAndInfoAboutPreviuos form={form}/>
                </Col>
                <Col span={24}>
                    <Complaints  />
                </Col>
                <Col span={24}>
                    <Anamnesis  />
                </Col>
                <Col span={24}>
                    <Consultations form={form}/>
                </Col>
                <Col span={24}>
                    <Diagnosis form={form}/>
                </Col>
                <Col span={24}>
                    <Treatment  />
                </Col>
                <Col span={24}>
                    <Conclusion form={form}/>
                </Col>
            </Row>
            <SaveOrDelete patient={Patient}/>
        </Form> : (isHaveDeath && Patient) ?
        <Empty description={
                <Typography style={cardTitle}>Пациент мёртв, создать новые осмотры - нельзя</Typography>
        }/> : 
        <Empty description={
            <Typography style={cardTitle}>Не выбран пациент</Typography>
        }/>}
        
    </Flex>);
}

export default CreationInspectionFormWrapper;
