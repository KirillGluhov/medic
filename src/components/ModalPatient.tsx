import { CalendarOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Typography, message } from "antd";
import { patientTopSizeStyle, cardButtonStyle, boldText, userAddIconStyle, cardTitle, cardSizeStyle, datePickerStyle, phoneStyle } from "../styles/additionalStyles";
import dayjs from "dayjs";
import { useState } from "react";
import type { FormProps } from 'antd';
import axios from "axios";
import { baseUrl } from "../const/constValues";
import { useLocation, useNavigate } from "react-router-dom";

const {Paragraph, Title} = Typography;

type FieldType = {
    name?: string;
    gender?: string;
    birthday?: string;
};

function ModalPatient()
{
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        if (values.birthday) 
        {
            values.birthday = dayjs(values.birthday).format('YYYY-MM-DD');
        }
        
        axios.post(baseUrl + "patient", values, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(function (response) 
        {
            console.log(response);
            setIsModalOpen(false);
            form.resetFields();

            message.success("Пациент успешно создан");

            const reload = location.pathname + location.search
            navigate(reload);

        })
        .catch(function (error) 
        {
            console.log(error);

            form.setFields([
                { name: 'name', errors: [error.response.data.message] }
            ]);

        })
    }

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleOk = () => {
        setIsModalOpen(false);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (<>
    <Button
        htmlType='submit' 
        type='primary'
        style={
            {
                ...patientTopSizeStyle, 
                ...cardButtonStyle, 
                ...boldText
            }
        }
        onClick={showModal}
    >
            <UserAddOutlined style={userAddIconStyle}/>Регистрация нового пациента
    </Button>

    <Modal 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={null}
    >
        <Title style={cardTitle}>Регистрация пациента</Title>
        <br/>
        <Form
            form={form}
            hideRequiredMark
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="ФИО"
                layout="vertical"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Имя не должно быть пустым',
                    },
                    {
                        validator(_, value) {
                            if (value && (value.length < 1 || value.length > 1000)) {
                                return Promise.reject('Длиня имени должна быть в диапазоне [1, 1000]');
                            }
                            return Promise.resolve();
                            
                            },
                    }
                ]}
            >
                <Input
                    placeholder='Иванов Иван Иванович'
                    style={{...cardSizeStyle}}
                />
            </Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                    label="Пол"
                    layout="vertical"
                    name="gender"
                    rules={[
                        {
                            required: true,
                            message: 'Пол не может быть пустым',
                        }
                    ]}
                    >
                        <Select
                            options={[
                                { value: 'Female', label: 'Женский' },
                                { value: 'Male', label: 'Мужской' }
                            ]}
                            style={{...cardSizeStyle}}
                        >
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Дата рождения"
                        layout="vertical"
                        name="birthday">
                        <DatePicker 
                            format={{
                                format: 'DD.MM.YYYY',
                                type: 'mask',
                            }} 
                            placeholder="дд.мм.ггг" 
                            suffixIcon={<CalendarOutlined style={datePickerStyle} />}
                            minDate={dayjs('1900-08-01', 'YYYY-MM-DD')}
                            maxDate={dayjs()}
                            style={{...cardSizeStyle, ...datePickerStyle}}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item>
                <Button
                    htmlType='submit' 
                    block
                    type='primary'
                    style={
                        {
                            ...cardSizeStyle, 
                            ...cardButtonStyle, 
                            ...boldText
                        }
                    }
                >Зарегистрировать</Button>
            </Form.Item>
        </Form>
    </Modal>
    </>);
}

export default ModalPatient;