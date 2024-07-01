import { Card, Form, Typography, Button, Input, Row, Col, Select, DatePicker, message } from "antd";
import { 
    profileCardStyle, 
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
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchProfile } from "../../actions/ProfileActions";
import { RootState, useAppDispatch } from "../../stores/store";

export type ProfileType = {
    email?: string;
    name?: string;
    gender?: string;
    birthday?: string;
    phone?: string;
};

const {Paragraph, Title} = Typography;

function ProfileCard()
{
    const {profile, loading, error} = useSelector((state: RootState) => state.profile);
    const {isLogin, setIsLogin} = useLogin();
    const {isName, setIsName} = useName();
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const [currentProfile, setCurrentProfile] = useState<ProfileType>();
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        axios.get(
            baseUrl + "doctor/profile", 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setCurrentProfile(response.data);
            form.setFieldsValue({
                name: response.data.name,
                gender: response.data.gender,
                birthday: response.data.birthday ? dayjs(response.data.birthday) : null,
                phone: response.data.phone,
                email: response.data.email,
            });
        }).catch(error => {
            console.log(error)
            dispatch(fetchProfile());
        })

    }, [isLogin])

    /*useEffect(() => {
        dispatch(fetchProfile());
    },[dispatch])*/

    useEffect(() => {
        if (currentProfile)
        {
            form.setFieldsValue({
                name: currentProfile.name,
                gender: currentProfile.gender,
                birthday: currentProfile.birthday ? dayjs(currentProfile.birthday) : null,
                phone: currentProfile.phone,
                email: currentProfile.email,
            });
        }
        
    },[currentProfile])

    const onFinish: FormProps<ProfileType>['onFinish'] = (values) => {
        if (values.birthday) {
            values.birthday = dayjs(values.birthday).format('YYYY-MM-DD');
        }

        axios.put(baseUrl + "doctor/profile", values, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            })
        .then(function (response) 
        {
            console.log(response);

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
                setIsName(response.data.name);
            })
            .catch(error => {
                console.log(error);
            })

            message.success("Изменения сохранены");
            const reload = location.pathname + location.search
            navigate(reload);

        })
        .catch(function (error) 
        {
            console.log(error);

            form.setFields([
                { name: 'email', errors: [error.response.data.message] }
            ]);

        })
    };

    const onFinishFailed: FormProps<ProfileType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Card style={profileCardStyle}>
            <Title style={cardTitle}>Профиль</Title>
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
                                placeholder="дд.мм.гггг" 
                                suffixIcon={<CalendarOutlined style={datePickerStyle} />}
                                minDate={dayjs('1900-01-01', 'YYYY-MM-DD')}
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
                    >Сохранить изменения</Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default ProfileCard;