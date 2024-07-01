import { Card, Form, Input, Typography } from "antd";
import { inspectionCardStyle, titleInOneBlockStyle, withoutPaddingTop, textAreaStyle } from "../../styles/additionalStyles";

const { TextArea } = Input;

function Treatment()
{
    return (<Card style={{...inspectionCardStyle}}>
        <Typography.Title style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>Рекомендации по лечению</Typography.Title>
        <Form.Item 
            name="treatment" 
            rules={[
                {
                    required: true,
                    message: 'Рекомендации не могут быть пустыми',
                },
                {
                    validator(_, value) {
                        if (value && (value.length < 1 || value.length > 5000))
                        {
                            return Promise.reject('Длина рекомендаций должна быть в диапазоне [1, 5000]');
                        }
                        return Promise.resolve();   
                    },
                }
            ]}
        >
            <TextArea rows={2} style={{...textAreaStyle, resize: 'none'}}/>
        </Form.Item>
    </Card>)
}

export default Treatment;