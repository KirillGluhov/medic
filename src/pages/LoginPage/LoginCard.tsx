import { Card, Form, Typography, Button, Input } from 'antd';
import type { FormProps } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../const/constValues';
import { 
    loginCardStyle, 
    cardTitle, 
    cardSizeStyle, 
    cardButtonWrraperStyle, 
    cardButtonStyle,
    registrationButton,
    boldText,
} from '../../styles/additionalStyles';
import { useNavigate } from 'react-router-dom';
import { chooseErrorMessage } from '../../functions/smallFunctions';
import { useLogin } from '../../context/LoginContext';
import { useName } from '../../context/NameContext';
import { useDispatch } from 'react-redux';

const {Title} = Typography;

type FieldType = {
    email?: string;
    password?: string;
};

function LoginCard()
{
    const [form] = Form.useForm();
    const {isLogin, setIsLogin} = useLogin();
    const {isName, setIsName} = useName();
    const navigate = useNavigate();

    const handleRegistration = () => {
        navigate("/registration/")
    }

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        axios.post(baseUrl + "doctor/login", values)
        .then(function (response) 
        {
            console.log(response);
            localStorage.setItem("token", response.data.token);
            setIsLogin(true);

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
                { name: 'email', errors: [chooseErrorMessage(error.response.data.message)] },
                { name: 'password', errors: [chooseErrorMessage(error.response.data.message)] }
            ]);

        })
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Card style={loginCardStyle}>
            <Title style={cardTitle}>Вход</Title>
            <br/>
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                requiredMark="optional"
                layout="vertical"
            >
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
                        style={{...cardSizeStyle}}
                    />
                </Form.Item>
                <Form.Item style={{...cardButtonWrraperStyle}}>
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
                    >
                        Войти
                    </Button>
                </Form.Item>
                <Form.Item style={{...cardButtonWrraperStyle}}>
                    <Button 
                        block 
                        type='primary'
                        style={
                            {
                                ...cardSizeStyle, 
                                ...registrationButton, 
                                ...boldText
                            }
                        }
                        onClick={handleRegistration}
                    >
                        Регистрация
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default LoginCard;