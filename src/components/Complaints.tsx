import { Card, Form, FormInstance, Input, Typography } from "antd";
import { 
    filterCardStyle, 
    titleInOneBlockStyle,
    withoutPaddingTop,
    textAreaStyle,
    inspectionCardStyle
} from "../styles/additionalStyles";
import { useEffect } from "react";

const { TextArea } = Input;

function Complaints()
{
    return (<Card style={{...inspectionCardStyle}}>
        <Typography.Title style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>Жалобы</Typography.Title>
        <Form.Item 
            name="complaints" 
            rules={[
                {
                    required: true,
                    message: 'Жалобы не могут быть пусты',
                },
                {
                    validator(_, value) {
                        if (value && (value.length < 1 || value.length > 5000))
                        {
                            return Promise.reject('Длина жалоб должна быть в диапазоне [1, 5000]');
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

export default Complaints;