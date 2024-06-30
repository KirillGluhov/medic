import { Button, Col, Form, FormProps, Modal, Row, Typography, message } from "antd";
import { cardSizeStyle, cardButtonStyle, boldText, cardTitle } from "../styles/additionalStyles";
import { useState } from "react";
import Complaints from "./Complaints";
import { InspectionFull } from "./DetailsInspection";
import Anamnesis from "./Anamnesis";
import Treatment from "./Treatment";
import Conclusion from "./Conclusion";
import dayjs, { Dayjs } from "dayjs";
import Diagnosis from "./Diagnosis";
import DiagnosInfo from "./DiagnosInfo";
import ChangeOrDelete from "./ChangeOrDelete";
import axios from "axios";
import { baseUrl } from "../const/constValues";

const {Title} = Typography

interface ModalInspectionProps
{
    inspection: InspectionFull,
    reGet: () => void,
    showMessage: () => void,
}

type DiagnosSmall = {
    icdDiagnosisId: string,
    description?: string,
    type: "Main" | "Concomitant" | "Complication"
}

type FormTypes = {
    complaints: string,
    anamnesis?: string,
    treatment: string,
    conclusion: 'Disease' | 'Recovery' | 'Death',
    nextVisitDate?: Dayjs,
    deathDate?: Dayjs,
    diagnoses: DiagnosSmall[]
};

const ModalInspection: React.FC<ModalInspectionProps> = ({inspection, reGet, showMessage}) =>
{
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onFinish: FormProps<FormTypes>['onFinish'] = (values) => {
        console.log('Success:', values);

        const data = {
            anamnesis: values.anamnesis,
            complaints: values.complaints,
            treatment: values.treatment,
            conclusion: values.conclusion,
            nextVisitDate: (values.nextVisitDate) ? values.nextVisitDate.toISOString() : null,
            deathDate: (values.deathDate) ? values.deathDate.toISOString() : null,
            diagnoses: values.diagnoses
        }

        console.log("Данные:", data);

        axios.put(baseUrl + `inspection/${inspection.id}`, data, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setIsModalOpen(false);
            showMessage();
            reGet();
        })
        .catch(error => {
            console.log(error);
            message.error("Не удалось изменить осмотр")
        })
    };

    const onFinishFailed: FormProps<FormTypes>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const showModal = () => {
        setIsModalOpen(true);
        form.setFieldsValue({
            complaints: inspection.complaints,
            anamnesis: inspection.anamnesis,
            treatment: inspection.treatment,
            conclusion: inspection.conclusion,
            nextVisitDate: inspection.nextVisitDate ? dayjs(inspection.nextVisitDate) : undefined,
            deathDate: inspection.deathDate ? dayjs(inspection.deathDate) : undefined,
            diagnoses: (inspection.diagnoses) ? inspection.diagnoses.map((diag) => ({
                type: diag.type,
                description: diag.description,
                icdDiagnosisId: diag.id
            })) : undefined
        });
    };
    
    const handleOk = () => {
        setIsModalOpen(false);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    
    return (
        <>
            <Button 
                type='primary'
                style={
                    {
                        ...cardSizeStyle, 
                        ...cardButtonStyle, 
                        ...boldText
                    }
                }
                onClick={showModal}
            >Редактировать осмотр
            </Button>

            <Modal 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Title style={cardTitle}>Редактирование осмотра</Title>
                <br/>
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    requiredMark={false}
                >
                <Row gutter={[16,16]}>
                    <Col span={24}>
                        <Complaints/>
                    </Col>
                    <Col span={24}>
                        <Anamnesis/>
                    </Col>
                    <Col span={24}>
                        <Treatment  />
                    </Col>
                    <Col span={24}>
                        <DiagnosInfo form={form} previousInspectionId={inspection.previousInspectionId} diagnosises={inspection.diagnoses}/>
                    </Col>
                    <Col span={24}>
                        <Conclusion form={form} fromModal={true}/>
                    </Col>
                </Row>
                <ChangeOrDelete handleCancel={handleCancel}/>
                </Form>
            </Modal>
        </>
    );
}

export default ModalInspection;