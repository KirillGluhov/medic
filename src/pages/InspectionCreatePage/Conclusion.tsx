import { Card, Col, DatePicker, Form, FormInstance, Row, Select, Typography } from "antd";
import { commentaryStyle, datePickerStyle, inspectionCardStyle, textAreaStyle, titleInOneBlockStyle, withoutPaddingTop } from "../../styles/additionalStyles";
import React from "react";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface ConclusionProps
{
    form: FormInstance<any>;
    fromModal?: boolean
}

const Conclusion: React.FC<ConclusionProps> = ({form, fromModal}) =>
{
    const conclusionValue = Form.useWatch("conclusion", form);
    const currentInspection = Form.useWatch("date", form);

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
        <Typography.Title style={{...titleInOneBlockStyle, ...withoutPaddingTop}} className="paddingBottom">Заключение</Typography.Title>
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
                
                options={[
                    { value: 'Disease', label: 'Болезнь' },
                    { value: 'Recovery', label: 'Выздоровление' },
                    { value: 'Death', label: 'Смерть' }
                ]}
                />
                </Form.Item>
            </Col>
            {
                (conclusionValue === "Disease") ? 
                <Col md={fromModal ? 12 : 8} span={12}>
                    <span style={commentaryStyle}>Дата следующего визита</span>
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
                            minDate={dayjs()}
                            disabledTime={disabledTime}
                            style={{...textAreaStyle, ...datePickerStyle}}
                        />
                    </Form.Item>
                </Col> : 
                (conclusionValue === "Death") ?
                <Col md={fromModal ? 12 : 8} span={12}>
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