import { Button, Col, Row } from "antd";
import { 
    boldText, 
    cardButtonStyle, 
    cardSizeStyle, 
    registrationButton, 
    styleForWrapperContent,
    confirmButtonStyle
} from "../styles/additionalStyles";

function SaveOrDelete()
{
    return (
    <Row 
        gutter={16} 
        style={{...styleForWrapperContent, ...confirmButtonStyle}}
    >
        <Col>
            <Button
                htmlType='submit' 
                type='primary'
                style={
                    {
                        ...cardSizeStyle, 
                        ...cardButtonStyle, 
                        ...boldText
                    }
                }
            >
                Сохранить осмотр
            </Button>
        </Col>
        <Col>
            <Button
                type='primary'
                style={
                    {
                        ...cardSizeStyle, 
                        ...registrationButton, 
                        ...boldText
                    }
                }
            >
                Отмена
            </Button>
        </Col>
    </Row>);
}

export default SaveOrDelete;