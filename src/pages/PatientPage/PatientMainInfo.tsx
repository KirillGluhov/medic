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
    headerColStyle,
    bottomStyle,
    deleteBottom,
    smallBottom
} from "../../styles/additionalStyles";
import { WomanOutlined, ManOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../const/constValues";
import { useLocation, useNavigate } from "react-router-dom";
import { changeFormat } from "../../functions/smallFunctions";
import { useDispatch } from "react-redux";
import { setPatientId } from "../../actions/patientActions";

const {Paragraph, Title} = Typography;

export interface PatientInfo
{
    id: string,
    name: string,
    birthday: string | null,
    createTime: string,
    gender: string
}

type PatientMainInfoProps = {
    setPatientInfo: (info: PatientInfo | null) => void;
};

const PatientMainInfo: React.FC<PatientMainInfoProps> = ({setPatientInfo}) =>
{
    const dispatch = useDispatch();

    const location = useLocation();
    const navigate = useNavigate();

    const [localPatientInfo, setLocalPatientInfo] = useState<PatientInfo | null>(null);

    const handleCreateInspection = () =>
    {
        localStorage.setItem("inspection", '');
        navigate('/inspection/create');
    }

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
            setLocalPatientInfo(response.data);
            dispatch(setPatientId(response.data.id));
        })
        .catch(error => {
            console.log(error);
        })
    },[])

    return (<Col style={changeMarginTop}>
        {localPatientInfo ? 
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
                        onClick={handleCreateInspection}
                        className="addInspectionOnCard"
                    >Добавить осмотр</Button>
                </Col>
            </Row>
            <Row style={{...rowJustifyBetween, ...smallBottom}}>
                <Col>
                    <Paragraph style={{...paragraphStyle, ...deleteBottom}}>
                        {localPatientInfo.name}
                        {
                            (localPatientInfo.gender === "Female") ? 
                            <WomanOutlined style={genderStyle}/> 
                            : (localPatientInfo.gender === "Male") ? 
                            <ManOutlined style={genderStyle}/> 
                            : null
                        }
                    </Paragraph>
                </Col>
                <Col style={{...headerColStyle, ...bottomStyle}}>
                    <Paragraph style={deleteBottom}>
                        <span>Дата рождения: </span>
                        {
                            localPatientInfo.birthday ? 
                            changeFormat(localPatientInfo.birthday) : 
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