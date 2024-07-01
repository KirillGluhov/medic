import { Card, Form, Typography, Button, Input, Row, Col, Select, DatePicker } from "antd";
import { 
    registrationCardStyle, 
    cardTitle, 
    cardSizeStyle,
    boldText,
    cardButtonStyle,
    datePickerStyle,
    phoneStyle
} from "../../styles/additionalStyles";
import type { FormProps } from 'antd';
import InputMask from 'react-input-mask';
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../const/constValues";
import { useLogin } from "../../context/LoginContext";
import { useName } from "../../context/NameContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

interface item {
    id: string,
    name: string,
    createTime: string
}

type FieldType = {
    email?: string;
    password?: string;
    name?: string;
    gender?: string;
    speciality?: string;
    birthday?: string;
    phone?: string;
};

const {Title} = Typography;

function RegistrationCard()
{
    const navigate = useNavigate();
    const {isLogin, setIsLogin} = useLogin();
    const {isName, setIsName} = useName();
    const [form] = Form.useForm();
    const [specilities, setSpecialities] = useState<Array<item>>([]);

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        if (values.birthday) {
            values.birthday = dayjs(values.birthday).format('YYYY-MM-DD');
        }
        
        axios.post(baseUrl + "doctor/register", values)
        .then(function (response) 
        {
            console.log(response);
            localStorage.setItem("token", response.data.token);
            setIsLogin(true);
            //dispatch(setIsLogin(true));

            axios.get(baseUrl + "doctor/profile",
                { 
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}` 
                    } 
                }
            )
            .then(response => {
                console.log(response);
                localStorage.setItem("name", response.data.name);
                localStorage.setItem("me", response.data.id);
                setIsName(response.data.name);
                navigate("/patients/");
            })
            .catch(error => {
                console.log(error);
            })

        })
        .catch(function (error) 
        {
            console.log(error);

            form.setFields([
                { name: 'email', errors: [error.response.data.message] }
            ]);

        })
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        axios.get(baseUrl + "dictionary/speciality", {
            params: {
              page: 1,
              size: 100
            }
        })
        .then(response => {
            console.log(response);
            setSpecialities(response.data.specialties)
        })
        .catch(error => {
            console.log(error);
        })
    },[])

    return (
        <Card style={registrationCardStyle}>
            <Title style={cardTitle}>Регистрация</Title>
            <br/>
            <Form
                form={form}
                hideRequiredMark
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Имя"
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
                <Form.Item
                    label="Телефон"
                    layout="vertical"
                    name="phone"
                >
                    <InputMask
                        mask="+7 (999) 999-99-99" 
                        style={{...cardSizeStyle, ...phoneStyle}} 
                        placeholder="+7 (xxx) xxx-xx-xx"
                    /> 
                </Form.Item>
                <Form.Item
                    label="Специальность"
                    layout="vertical"
                    name="speciality"
                    rules={[
                        {
                            required: true,
                            message: 'Специальность не может быть пустой',
                        }
                    ]}
                >
                    <Select
                        options={specilities.map(item => ({
                            value: item.id,
                            label: item.name
                        }))}
                        style={{...cardSizeStyle}}
                    >
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Email"
                    layout="vertical"
                    name="email"
                    rules={[
                        {
                        type: 'email',
                        message: 'Это не email',
                        },
                        {
                        required: true,
                        message: 'Email не должен быть пустым',
                        },
                    ]}
                >
                    <Input 
                        placeholder='name@example.com' 
                        style={{...cardSizeStyle}}
                    />
                </Form.Item>
                <Form.Item
                    label="Пароль"
                    layout="vertical"
                    name="password"
                    rules={[
                        {
                        required: true,
                        message: 'Пароль не должен быть пустым',
                        },
                        {
                            validator(_, value) {
                                if (value && value.length < 6) {
                                return Promise.reject('Пароль должен состоять хотя бы из 6 символов');
                                }
                                return Promise.resolve();
                                
                            },
                        }
                    ]}
                >
                    <Input
                    style={{...cardSizeStyle}}/>
                </Form.Item>
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
                    >Зарегистрироваться</Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default RegistrationCard;