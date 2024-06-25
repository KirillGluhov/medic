import { Flex, Typography, Form, Row, Col } from "antd";
import { 
    cardTitle, 
    contentWrapper,
    titleInspectionStyle
} from "../styles/additionalStyles";
import SaveOrDelete from "./SaveOrDelete";
import Complaints from "./Complaints";
import Anamnesis from "./Anamnesis";
import DateOfInspectionAndInfoAboutPreviuos from "./DateOfInspectionAndInfoAboutPreviuos";
import Treatment from "./Treatment";
import Consultations from "./Consultations";
import Conclusion from "./Conclusion";
import Diagnosis from "./Diagnosis";


function CreationInspectionFormWrapper()
{
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (<Flex style={{...contentWrapper}}>
        <Typography.Title style={{...cardTitle, ...titleInspectionStyle}}>Создание осмотра</Typography.Title>
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
                    <Complaints/>
                </Col>
                <Col span={24}>
                    <Anamnesis/>
                </Col>
                <Col span={24}>
                    <Consultations form={form}/>
                </Col>
                <Col span={24}>
                    <Diagnosis form={form}/>
                </Col>
                <Col span={24}>
                    <Treatment/>
                </Col>
                <Col span={24}>
                    <Conclusion form={form}/>
                </Col>
            </Row>
            <SaveOrDelete/>
        </Form>
    </Flex>);
}

export default CreationInspectionFormWrapper;