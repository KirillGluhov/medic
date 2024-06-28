import { Col, Empty, Flex, Row, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../const/constValues";
import { cardTitle, contentWrapper, smallMarginTop } from "../styles/additionalStyles";
import Complaint from "./Complaint";

type PatientModel = {
    id: string,
    createTime: string,
    name: string,
    birthday?: string,
    gender: "Male" | "Female"
}

type DoctorModel = {
    id: string,
    createTime: string,
    name: string,
    birthday?: string,
    gender: "Male" | "Female",
    email: string,
    phone?: string
}

type DiagnosisFullModel = {
    id: string,
    createTime: string,
    code: string,
    name: string,
    description?: string,
    type: "Main" | "Concomitant" | "Complication"
}

type SpecialityModel = {
    id: string,
    createTime: string,
    name: string
}

type InspectionCommentModel = {
    id: string,
    createTime: string,
    parentId?: string,
    content?: string,
    author?: DoctorModel,
    modifyTime?: string
}

type InspectionConsultationModel = {
    id: string,
    createTime: string,
    inspectionId?: string,
    speciality?: SpecialityModel,
    rootComment?: InspectionCommentModel,
    commentsNumber?: number
}

type InspectionFull = {
    id: string,
    createTime: string,
    date: string,
    anamnesis?: string,
    complaints?: string,
    treatment?: string,
    conclusion?: "Disease" | "Recovery" | "Death",
    nextVisitDate?: string,
    deathDate?: string,
    baseInspectionId?: string,
    previousInspectionId?: string,
    patient?: PatientModel,
    doctor?: DoctorModel,
    diagnoses?: DiagnosisFullModel[],
    consultations?: InspectionConsultationModel[]
}

function DetailsInspection()
{
    const location = useLocation();
    const [currentInspection, setCurrentInspection] = useState<InspectionFull | null>(null);
    
    useEffect(() => {
        let id = location.pathname.split("/")[2];

        axios.get(baseUrl + `inspection/${id}`, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response.data);
            setCurrentInspection(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    },[location])
    return (
        <Flex style={{...contentWrapper, ...smallMarginTop}}>
            <Row gutter={[16,16]}>
                {
                    currentInspection ? 
                    <>
                        <Col span={24}>
                            {/**/} 
                        </Col>
                        <Col span={24}>
                            <Complaint text={currentInspection.complaints} title="Жалобы"/>
                        </Col>
                        <Col span={24}>
                            <Complaint text={currentInspection.anamnesis} title="Анамнез заболевания"/>
                        </Col>
                        <Col span={24}>
                            {/**/}
                        </Col>
                        <Col span={24}>
                            {/**/}
                        </Col>
                        <Col span={24}>
                            {/**/}
                        </Col>
                        <Col span={24}>
                            <Complaint text={currentInspection.treatment} title="Рекомендации по лечению"/>
                        </Col>
                        <Col span={24}>
                            {/**/}
                        </Col>
                    </> : 
                    <Empty description={
                        <Typography style={cardTitle}>Нет такого id</Typography>
                    }/>
                }
            </Row>
        </Flex>
    );
}

export default DetailsInspection;