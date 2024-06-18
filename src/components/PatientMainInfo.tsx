import { Button, Col, Empty, Row, Typography } from "antd";
import { 
    cardTitle, 
    paragraphStyle,
    genderStyle, 
    cardSizeStyle,
    cardButtonStyle,
    boldText,
    changeMarginTop,
    rowJustifyBetween,
    changeMarginBottom,
    headerColStyleForMenu,
    headerColStyle,
    bottomStyle,
    deleteBottom,
    smallBottom
} from "../styles/additionalStyles";
import { WomanOutlined, ManOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../const/constValues";
import { useLocation } from "react-router-dom";
import { error } from "console";
import { changeFormat } from "../functions/smallFunctions";

const {Paragraph, Title} = Typography;

interface patientInfo
{
    id: string,
    name: string,
    birthday: string | null,
    createTime: string,
    gender: string
}

function PatientMainInfo()
{
    const location = useLocation();

    const [patientInfo, setPatientInfo] = useState<patientInfo | null>(null);

    useEffect(() => {

        let id = "";

        if (location.pathname.split("/").length > 2)
        {
            id += location.pathname.split("/")[2];
        }

        axios.get(baseUrl + `patient/${id}`, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setPatientInfo(response.data)
        })
        .catch(error => {
            console.log(error);
        })
    },[])

    return (<Col style={changeMarginTop}>
        {patientInfo ? 
        <>
            <Row style={{...rowJustifyBetween, ...changeMarginBottom}}>
                <Col>
                    <Title style={cardTitle}>Медицинская карта пациента</Title>
                </Col>
                <Col>
                    <Button
                        type='primary'
                        style={
                            {
                                ...cardSizeStyle, 
                                ...cardButtonStyle, 
                                ...boldText
                            }
                        }
                    >Добавить осмотр</Button>
                </Col>
            </Row>
            <Row style={{...rowJustifyBetween, ...smallBottom}}>
                <Col>
                    <Paragraph style={{...paragraphStyle, ...deleteBottom}}>
                        {patientInfo.name}
                        {
                            (patientInfo.gender === "Female") ? 
                            <WomanOutlined style={genderStyle}/> 
                            : (patientInfo.gender === "Male") ? 
                            <ManOutlined style={genderStyle}/> 
                            : null
                        }
                    </Paragraph>
                </Col>
                <Col style={{...headerColStyle, ...bottomStyle}}>
                    <Paragraph style={deleteBottom}>
                        <span>Дата рождения: </span>
                        {
                            patientInfo.birthday ? 
                            changeFormat(patientInfo.birthday) : 
                            "Не указано"
                        }
                    </Paragraph>
                </Col>
            </Row>
        </> : 
        <Empty description={
            <Typography style={cardTitle}>Нет пациента с таким id</Typography>
        }/>}
    </Col>);
}

export default PatientMainInfo;