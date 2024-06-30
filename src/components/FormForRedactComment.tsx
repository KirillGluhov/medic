import { Button, Col, Form, FormProps, Input, Row } from "antd";
import { boldText, cardButtonStyle, orangeColorStyle } from "../styles/additionalStyles";
import { useEffect } from "react";
import { CommentType } from "./FormForCommentCreate";
import axios from "axios";
import { baseUrl } from "../const/constValues";

interface FormForRedactCommentProps
{
    textContent: string,
    commentId: string,
    messageSuccess: (value: string) => void,
    messageError: (value: string) => void,
    repeatConsultation: () => void,
    setRedactNow: React.Dispatch<React.SetStateAction<boolean>>
}


const FormForRedactComment: React.FC<FormForRedactCommentProps> = (
    {textContent, commentId, messageSuccess, messageError, repeatConsultation, setRedactNow}
) =>
{
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            content: textContent
        })
    },[textContent, commentId])

    const onFinish: FormProps<CommentType>['onFinish'] = (values) => {
        console.log(values);

        const data = {
            content: values.content,
        }

        axios.put(baseUrl + `consultation/comment/${commentId}`, data, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setRedactNow(false);
            repeatConsultation();
            messageSuccess("Успешно изменено");
        })
        .catch(error => {
            console.log(error);
            const messageInfo = error?.response?.data?.message;

            setRedactNow(false);
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
                                ...orangeColorStyle, 
                                ...boldText
                            }
                        }
                    >Редактировать</Button>
                </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

export default FormForRedactComment;