import { Card, Col, DatePicker, Form, Row, Select, Switch, Typography } from "antd";
import { 
    bottomStyle,  
    commentaryStyle, 
    datePickerStyle, 
    deleteBottom, 
    filterSwitchStyle, 
    genderStyle, 
    headerColStyle, 
    improveColumn, 
    inspectionCardStyle, 
    paragraphStyle, 
    rowJustifyBetween, 
    smallBottom,
    spanStyle,
    styleOfInspectionLabel,
    textAreaStyle
} from "../../styles/additionalStyles";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../const/constValues";
import { CalendarOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";
import { changeFormat, changeFormatToDateAndTime, deleteLastSemicolon } from "../../functions/smallFunctions";
import { FormInstance } from "antd/lib";
import dayjs from "dayjs";
import { DiagnosisModel, InspectionPreview } from "../PatientPage/InspectionWrapper";

const {Paragraph} = Typography;

interface PatientCardInfo
{
    birthday?: string;
    createTime: string;
    gender: string;
    id: string;
    name: string;
}

interface DateOfInspectionAndInfoAboutPreviuosProps
{
    form: FormInstance<any>;
}

interface InspectionShort
{
    id: string,
    createTime: string,
    date: string,
    diagnosis: DiagnosisModel
}

const DateOfInspectionAndInfoAboutPreviuos: React.FC<DateOfInspectionAndInfoAboutPreviuosProps> = ({form}) =>
{
    const [Inspection, setInspection] = useState(() => {
        return localStorage.getItem('inspection') || ''
    });

    const [Patient, setPatient] = useState(() => {
        return localStorage.getItem("patient") || ''
    })

    const isRepeatInspectionValue = Form.useWatch('isRepeatInspection', form);

    const [isHaveDeath, setIsHaveDeath] = useState(false);
    const [deathId, setDeathId] = useState(null);

    const [currentPatient, setCurrentPatient] = useState<PatientCardInfo | null>(null);
    const [previousInspection, setPreviousInspection] = useState<InspectionPreview | null>(null);

    const [inspections, setInspections] = useState<InspectionShort[]>([]);

    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
    };

    useEffect(() => {
        axios.get(baseUrl + `patient/${Patient}/inspections?grouped=true&page=1&size=1`, 
        { 
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem("token")}` 
            } 
        })
        .then(response => {
            console.log(response);
            if
            (
                response.data 
                && response.data.inspections 
                && response.data.inspections[0] 
                && response.data.inspections[0].conclusion 
                && response.data.inspections[0].conclusion === "Death"
            ) 
            {
                setIsHaveDeath(true); 
                setDeathId(response.data.inspections[0].id)

            }
            else {setIsHaveDeath(false)}
        })
        .catch(error => {
            console.log(error);
        })
    },[currentPatient])

    const handleChange = (value: string) => {
        axios.get(baseUrl + `inspection/${value}`,
            { 
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response)
            setPreviousInspection(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    };

    const disabledTime = (current: any) => {
        const minDateTime = previousInspection ? 
        dayjs(deleteLastSemicolon(previousInspection.date), 'YYYY-MM-DD HH:mm') : 
        dayjs('1900-01-01T00:00', 'YYYY-MM-DD HH:mm');

        const now = dayjs();

        if (!current)
        {
          return {};
        }
    
        const minHours = minDateTime.hour();
        const minMinutes = minDateTime.minute();

        const maxHours = now.hour();
        const maxMinutes = now.minute();
    

        if (current.isSame(minDateTime, 'day'))
        {
            return {
                disabledHours: () => range(0, minHours),
                disabledMinutes: () => range(0, minMinutes),
            };
        }
        else if (current.isSame(now, 'day'))
        {
            return {
                disabledHours: () => range(maxHours+1, 24),
                disabledMinutes: () => range(maxMinutes+1, 60),
            };
        }
        else
        {
            return {};
        }
    };


    useEffect(() => {
        axios.get(baseUrl + `patient/${Patient}`,
            { 
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response)
            setCurrentPatient(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    },[])

    useEffect(() => {
        axios.get(baseUrl + `patient/${Patient}/inspections/search`,
            { 
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response)
            setInspections(response.data);
        })
        .catch(error => {
            console.log(error);
        })

        axios.get(baseUrl + `inspection/${Inspection}`,
            { 
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response)
            setPreviousInspection(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    },[Inspection])

    useEffect(() => {
        form.setFieldsValue({
            isRepeatInspection: Inspection ? true : false,
        });

        form.setFieldsValue({
            previousInspectionId: Inspection ? Inspection : undefined,
        });
    },[Inspection])

    return (
         <Card style={{...inspectionCardStyle}}>
         {currentPatient &&<>
            <Row style={{...rowJustifyBetween, ...smallBottom}}>
                    <Col>
                        <Paragraph style={{...paragraphStyle, ...deleteBottom}}>
                            {currentPatient.name}
                            {
                                (currentPatient.gender === "Female") ? 
                                <WomanOutlined style={genderStyle}/> 
                                : (currentPatient.gender === "Male") ? 
                                <ManOutlined style={genderStyle}/> 
                                : null
                            }
                        </Paragraph>
                    </Col>
                    <Col style={{...headerColStyle, ...bottomStyle}}>
                        <Paragraph style={deleteBottom}>
                            <span>Дата рождения: </span>
                            {
                                currentPatient.birthday ? 
                                changeFormat(currentPatient.birthday) : 
                                "Не указано"
                            }
                        </Paragraph>
                    </Col>
                </Row>
            <Row>
                <Col style={improveColumn}>
                    <Form.Item
                        name="isRepeatInspection"
                        layout="horizontal"
                        className="isRepeatInspection"
                        label={<span style={styleOfInspectionLabel} className="inspectionLabel">Первичный осмотр</span>}
                    >
                        <Switch 
                            className="mySwitch"
                            style={{...filterSwitchStyle}}
                        />
                    </Form.Item>
                    <span style={spanStyle}>Повторный осмотр</span>
                </Col>
            </Row>
            <Row>
                {
                    isRepeatInspectionValue ? 
                    <Col xl={8} md={12} sm={15} span={24}>
                        <span style={commentaryStyle}>Предыдущий осмотр</span>
                        <Form.Item
                            name="previousInspectionId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Есть предыдущий осмотр - значит не пустой',
                                }
                            ]}
                        >
                            <Select 
                                placeholder="Выберите осмотр"
                                onChange={handleChange}
                                style={{...textAreaStyle}} 
                                options={inspections.filter(insp => insp.id !== deathId).map(insp => ({
                                    value: insp.id,
                                    desc: insp.date,
                                    label: changeFormatToDateAndTime(insp.date) + " " + insp.diagnosis.code + " - " + insp.diagnosis.name
                                }))}
                            />
                        </Form.Item>
                    </Col> : null
                }
            </Row>
            <Row>
                <Col xl={8} md={12} sm={15} span={24}>
                    <span style={commentaryStyle}>Дата осмотра</span>
                    <Form.Item
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: 'Вы не ввели дату осмотра',
                            }
                        ]}
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
                                previousInspection ? 
                                dayjs(deleteLastSemicolon(previousInspection.date), 'YYYY-MM-DD HH:mm') : 
                                dayjs('1900-01-01T00:00', 'YYYY-MM-DD HH:mm')

                            }
                            disabledTime={disabledTime}
                            maxDate={dayjs()}
                            style={{...textAreaStyle, ...datePickerStyle}}
                        />
                    </Form.Item>
                </Col>
            </Row>
            </>}
        </Card>);
}

export default DateOfInspectionAndInfoAboutPreviuos;