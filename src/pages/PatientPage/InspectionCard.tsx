import { Card, Col, Row, Tag, Typography } from "antd";
import { 
    boldText,
    filterCardStyle, 
    rowJustifyBetween, 
    spanCardStyle, 
    textInspectionColor, 
    textStyle,
    bigAndMargin,
    improveColumn,
    bigAndBold,
    heightSmall,
    grayCardColor,
    cardButtonColor,
    smallPadding,
    iconNormalSize,
    deathCardStyle,
} from "../../styles/additionalStyles";
import { FormOutlined, PlusOutlined, SearchOutlined, MinusOutlined } from "@ant-design/icons";
import { InspectionPreview } from "./InspectionWrapper";
import { changeFormat, chooseConclusion, makeSmaller } from "../../functions/smallFunctions";
import { useLocation, useNavigate } from "react-router-dom";
import React, { MouseEventHandler, useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../const/constValues";

interface InspectionCardProps
{
    number: number
    inspection: InspectionPreview,
    onClickOpen?: MouseEventHandler<HTMLSpanElement>,
    hidden?: boolean,
    currentNumber: number | null,
    shouldPatient: boolean
}

const InspectionCard: React.FC<InspectionCardProps> = ({number, inspection, onClickOpen, hidden, currentNumber, shouldPatient}) =>
{
    const location = useLocation();
    const navigate = useNavigate();

    const [grouped, setGrouped] = useState(false);

    const handleCreateInspection = () =>
    {
        const idOfInspection = inspection.id;
        localStorage.setItem("inspection", idOfInspection);
        navigate("/inspection/create");
    }

    const handleOpenInspection = () => {
        const idOfInspection = inspection.id;
        navigate(`/inspection/${idOfInspection}`)
    }

    const handleClick = () => {
        axios.get(baseUrl + `inspection/${inspection.id}/chain`, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        ).then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {

        if (location.search && location.search.length > 0)
        {
            const url = location.search.split("?")[1];
            const filterAndSortingParameters = url.split("&");

            for (let i = 0; i < filterAndSortingParameters.length; i++)
            {
                const pairOfValues = filterAndSortingParameters[i].split("=");
                const name = pairOfValues[0];
                const value = pairOfValues[1];

                if (name === "grouped")
                {
                    if (value === "false")
                    {
                        setGrouped(false);
                    }
                    
                    if (value === "true")
                    {
                        setGrouped(true);
                    }
                }
            }
        }

    },[location])

    return (<Card 
            className={(number > 0 && number < 3) ? "leftAddedElement" : ""} 
            style={{
                ...(inspection.conclusion === "Death" ? deathCardStyle : filterCardStyle), 
                marginTop: number > 0 ? 16 : 0, 
                width: number == 0 ? '100%' : number == 1 ? `calc(100% - 25px)` : number > 1 ? `calc(100% - 50px)` : '100%',
                marginLeft: number >= 2 ? 50 : number >= 1 ? 25 : 0,
                position: "relative",
                display: hidden ? "none" : "block"
            }}
        >
        <Row style={rowJustifyBetween}>
            <Col>
                <Row>
                    <Col>
                        {(grouped && inspection.hasNested) ? <Tag 
                            color={cardButtonColor} 
                            style={{...textStyle, ...heightSmall, ...smallPadding, ...iconNormalSize}}
                            onClick={onClickOpen}
                        >
                            {
                                (currentNumber !== null && currentNumber <= number) ? 
                                <PlusOutlined className="openInspection"/> :
                                <MinusOutlined className="openInspection"/>
                                
                            }
                        </Tag> : null}
                    </Col>
                    <Col>
                        <Tag 
                            color={grayCardColor} 
                            style={{...textStyle, ...heightSmall}}
                        >{changeFormat(inspection.date)}</Tag>
                    </Col>
                    <Col>
                        <Typography.Paragraph 
                            style={{...textStyle, ...bigAndBold}}
                        >Амбулаторный осмотр</Typography.Paragraph>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row gutter={10}>
                    <Col>
                        {(inspection.conclusion === "Death" || inspection.hasNested || !shouldPatient) ? null : <Typography.Paragraph 
                            style={
                                {
                                    ...textStyle, 
                                    ...textInspectionColor, 
                                    ...improveColumn
                                }
                            }
                            className="addInspectionOnCard"
                            onClick={handleCreateInspection}
                        >
                            <FormOutlined style={bigAndMargin}/>Добавить осмотр
                        </Typography.Paragraph>}
                    </Col>
                    <Col>
                        <Typography.Paragraph 
                            style={
                                {
                                    ...textStyle, 
                                    ...textInspectionColor, 
                                    ...improveColumn,
                                }
                            }
                            className="openInspection"
                            onClick={handleOpenInspection}
                        >
                            <SearchOutlined style={bigAndMargin}/>Детали осмотра
                        </Typography.Paragraph>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col>
                <Typography.Paragraph style={{...textStyle}}>
                    Заключение: <span style={boldText}>{chooseConclusion(inspection.conclusion)}</span>
                </Typography.Paragraph>
            </Col>
        </Row>
        <Row>
            <Col>
                <Typography.Paragraph style={{...textStyle}}>
                    Основной диагноз: <span style={boldText}>{makeSmaller(inspection.diagnosis.name) + " (" + inspection.diagnosis.code + ")"}</span>
                </Typography.Paragraph>
            </Col>
        </Row>
        <Row>
            <Col>
                <Typography.Paragraph style={{...spanCardStyle, ...textStyle}}>
                    Медицинский работник: <span>{inspection.doctor}</span>
                </Typography.Paragraph>
            </Col>
        </Row>
    </Card>);
}

export default InspectionCard;