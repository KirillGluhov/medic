import { Button, Col, Row } from "antd";
import { 
    boldText, 
    cardButtonStyle, 
    cardSizeStyle, 
    registrationButton, 
    styleForWrapperContent,
    confirmButtonStyle,
    smallBottomMargin
} from "../styles/additionalStyles";
import { useNavigate } from "react-router-dom";
import React from "react";

interface ChangeOrDeleteProps
{
    handleCancel: () => void;
}

const ChangeOrDelete: React.FC<ChangeOrDeleteProps> = ({handleCancel}) =>
{

    return (
    <Row 
        gutter={16} 
        style={{...styleForWrapperContent, ...confirmButtonStyle, ...smallBottomMargin}}
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
                onClick={handleCancel}
            >
                Отмена
            </Button>
        </Col>
    </Row>);
}

export default ChangeOrDelete;