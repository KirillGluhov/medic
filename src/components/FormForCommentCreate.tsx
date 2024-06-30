import { Button, Col, Form, FormProps, Input, Row, message } from "antd";
import { boldText, cardButtonStyle, cardSizeStyle } from "../styles/additionalStyles";
import { baseUrl } from "../const/constValues";
import axios from "axios";
import { error } from "console";

interface FormForCommentCreateProps
{
    parentId: string,
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

            setAnswer(false);
            repeatConsultation();
            messageError("Что-то пошло не так");
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
                <Col span={20}>
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
                <Col span={4}>
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
                                ...boldText
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