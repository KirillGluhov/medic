import { Card, Form } from 'antd';
import { Layout, Flex, Typography, Button, Input, Tooltip } from 'antd';
import type { FormProps } from 'antd';
import { 
    loginCardStyle, 
    cardTitle, 
    cardSizeStyle, 
    cardButtonWrraperStyle, 
    cardBottomInput,
    cardLabelStyle,
    cardButtonStyle,
    registrationButton,
    boldText
} from '../styles/additionalStyles';

const {Paragraph, Title} = Typography;

type FieldType = {
    email?: string;
    password?: string;
};

function LoginCard()
{
    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
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
            >
                <Form.Item 
                    label={
                        <label style={{...cardLabelStyle}}>Email</label>
                    }
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
                <br />
                <Form.Item 
                    label={<label style={{...cardLabelStyle}}>Пароль</label>}
                    layout="vertical"
                    name="password"
                    rules={[
                        {
                          required: true,
                          message: 'Пароль не должен быть пустым',
                        }
                    ]}
                >
                    <Input
                        style={{...cardSizeStyle}}
                    />
                </Form.Item>
                <br />
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
                    >
                        Регистрация
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default LoginCard;