import { Card, Col, DatePicker, Form, FormInstance, Row, Select, Typography } from "antd";
import { commentaryStyle, datePickerStyle, inspectionCardStyle, textAreaStyle, titleInOneBlockStyle, withoutPaddingTop } from "../styles/additionalStyles";
import React, { useEffect, useState } from "react";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { deleteLastSemicolon } from "../functions/smallFunctions";
import axios from "axios";
import { baseUrl } from "../const/constValues";
import { error } from "console";

interface ConclusionProps
{
    form: FormInstance<any>;
}

const Conclusion: React.FC<ConclusionProps> = ({form}) =>
{
    const conclusionValue = Form.useWatch("conclusion", form);
    const currentInspection = Form.useWatch("date", form);
    const [isHaveDeath, setIsHaveDeath] = useState(false);

    useEffect(() => {
        axios.get(baseUrl + `patient/${localStorage.getItem("patient")}/inspections?grouped=true&page=1&size=1`, 
        { 
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem("token")}` 
            } 
        })
        .then(response => {
            console.log(response);
            (
                response.data 
                && response.data.inspections 
                && response.data.inspections[0] 
                && response.data.inspections[0].conclusion 
                && response.data.inspections[0].conclusion === "Death"
            ) 
                ? setIsHaveDeath(true) 
                : setIsHaveDeath(false)
        })
        .catch(error => {
            console.log(error);
        })
    })

    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
    };

    const disabledTime = (current: any) => {
        const minDateTime = currentInspection ? 
        dayjs(currentInspection, 'YYYY-MM-DD HH:mm') : 
        dayjs('1900-01-01T00:00', 'YYYY-MM-DD HH:mm');

        const now = dayjs();

        if (!current)
        {
          return {};
        }
    
        const minHours = minDateTime.hour();
        const minMinutes = minDateTime.minute();
    

        if (current.isSame(minDateTime, 'day'))
        {
            return {
                disabledHours: () => range(0, minHours),
                disabledMinutes: () => range(0, minMinutes),
            };
        }
        else
        {
            return {};
        }
    };

    return (<Card style={{...inspectionCardStyle}}>
        <Typography.Title style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>Заключение</Typography.Title>
        <Row gutter={[16,16]}>
            <Col md={8} span={12}>
                <span style={commentaryStyle}>Заключение</span>
                <Form.Item
                    name="conclusion"
                    rules={[
                        {
                            required: true,
                            message: 'Заключение не должно быть пустым',
                        }
                    ]}
                >
                <Select
                
                options={isHaveDeath ? [
                    { value: 'Disease', label: 'Болезнь' },
                    { value: 'Recovery', label: 'Выздоровление' },
                ] : [
                    { value: 'Disease', label: 'Болезнь' },
                    { value: 'Recovery', label: 'Выздоровление' },
                    { value: 'Death', label: 'Смерть' }
                ]}
                />
                </Form.Item>
            </Col>
            {
                (conclusionValue === "Disease") ? 
                <Col md={8} span={12}>
                    <span style={commentaryStyle}>Дата осмотра</span>
                    <Form.Item
                        name="nextVisitDate"
                    >
                        <DatePicker 
                            placeholder="дд.мм.гггг чч:мм" 
                            showTime={{ format: 'HH:mm' }} 
                            format={{
                                format: 'DD.MM.YYYY HH:mm',
                                type: 'mask',
                            }}
                            suffixIcon={<CalendarOutlined style={datePickerStyle} />}
                            minDate=
                            {
                                currentInspection ? 
                                dayjs(currentInspection, 'YYYY-MM-DD HH:mm') : 
                                dayjs('1900-01-01T00:00', 'YYYY-MM-DD HH:mm')

                            }
                            disabledTime={disabledTime}
                            style={{...textAreaStyle, ...datePickerStyle}}
                        />
                    </Form.Item>
                </Col> : 
                (conclusionValue === "Death") ?
                <Col md={8} span={12}>
                    <span style={commentaryStyle}>Дата и время смерти</span>
                    <Form.Item
                        name="deathDate"
                    >
                        <DatePicker 
                            placeholder="дд.мм.гггг чч:мм" 
                            showTime={{ format: 'HH:mm' }} 
                            format={{
                                format: 'DD.MM.YYYY HH:mm',
                                type: 'mask',
                            }}
                            suffixIcon={<CalendarOutlined style={datePickerStyle} />}
                            minDate=
                            {
                                currentInspection ? 
                                dayjs(currentInspection, 'YYYY-MM-DD HH:mm') : 
                                dayjs('1900-01-01T00:00', 'YYYY-MM-DD HH:mm')

                            }
                            disabledTime={disabledTime}
                            style={{...textAreaStyle, ...datePickerStyle}}
                        />
                    </Form.Item>
                </Col> : null
            }
        </Row>
    </Card>);
}

export default Conclusion;