import { Card, Form, Input, Typography } from "antd";
import { filterCardStyle, inspectionCardStyle, textAreaStyle, titleInOneBlockStyle, withoutPaddingTop } from "../styles/additionalStyles";

const { TextArea } = Input;

function Anamnesis()
{
    return (<Card style={{...inspectionCardStyle}}>
        <Typography.Title style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>Анамнез заболевания</Typography.Title>
        <Form.Item 
            name="anamnesis" 
            rules={[
                {
                    required: true,
                    message: 'Анамнез не могут быть пустым',
                },
                {
                    validator(_, value) {
                        if (value && (value.length < 1 || value.length > 5000))
                        {
                            return Promise.reject('Длина анамнеза должна быть в диапазоне [1, 5000]');
                        }
                        return Promise.resolve();   
                    },
                }
            ]}
        >
            <TextArea rows={2} style={textAreaStyle}/>
        </Form.Item>
    </Card>)
}

export default Anamnesis;