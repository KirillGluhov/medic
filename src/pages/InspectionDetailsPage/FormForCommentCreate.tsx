import { Button, Col, Form, FormProps, Input, Row } from "antd";
import { boldText, cardButtonStyle } from "../../styles/additionalStyles";
import { baseUrl } from "../../const/constValues";
import axios from "axios";

interface FormForCommentCreateProps
{
    parentId?: string,
    consultationId: string,
    setAnswer: React.Dispatch<React.SetStateAction<boolean>>,
    repeatConsultation: () => void,
    messageSuccess: (value: string) => void,
    messageError: (value: string) => void
}

export type CommentType = {
    content?: string;
};

const FormForCommentCreate: React.FC<FormForCommentCreateProps> = (
    {parentId, consultationId, setAnswer, repeatConsultation, messageSuccess, messageError}
) => 
{
    const [form] = Form.useForm();

    const onFinish: FormProps<CommentType>['onFinish'] = (values) => {
        console.log(values);

        const data = {
            content: values.content,
            parentId: parentId
        }

        axios.post(baseUrl + `consultation/${consultationId}/comment`, data, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setAnswer(false);
            repeatConsultation();
            messageSuccess("Успешно создано");
        })
        .catch(error => {
            console.log(error);
            const messageInfo = error?.response?.data?.message;

            if (typeof messageInfo === 'string' && messageInfo.startsWith("User doesn't have a specialty to participate"))
            {
                setAnswer(false);
                repeatConsultation();
                messageError("У вас неподходящая специализация");
            }
            else
            {
                setAnswer(false);
                repeatConsultation();
                messageError("Что-то пошло не так");
            }

            
        })
    }

    const onFinishFailed: FormProps<CommentType>['onFinishFailed'] = (errorvalues) => {
        console.log(errorvalues);
    }

    return (
        <Form
            form={form}
            hideRequiredMark
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={[10, 10]}>
                <Col xxl={20} xl={18} lg={18} md={16} span={24}>
                    <Form.Item
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: 'Комментарий не может быть пустым',
                            }
                        ]}
                        style={{marginBottom: 5}}
                    >
                        <Input
                            placeholder='Введите текст комментария'
                        />
                    </Form.Item>
                </Col>
                <Col xxl={4} xl={6} lg={6} md={8} span={24}>
                <Form.Item
                    style={{marginBottom: 5}}
                >
                    <Button
                        htmlType='submit' 
                        block
                        type='primary'
                        style={
                            {
                                ...cardButtonStyle, 
                                ...boldText,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }
                        }
                    >Оставить комментарий</Button>
                </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

export default FormForCommentCreate