import { Card, Col, DatePicker, Form, Row, Select, Switch, Typography } from "antd";
import { 
    bottomStyle, 
    cardSizeStyle, 
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
} from "../styles/additionalStyles";
import { usePatientAndInspection } from "../context/PatientAndInspectionContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../const/constValues";
import { error } from "console";
import { CalendarOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";
import { changeFormat, changeFormatToDateAndTime, deleteLastSemicolon } from "../functions/smallFunctions";
import { FormInstance } from "antd/lib";
import dayjs from "dayjs";
import { DiagnosisModel, InspectionPreview } from "./InspectionWrapper";

const {Paragraph, Title} = Typography;


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
    const {Patient, setPatient, Inspection, setInspection} = usePatientAndInspection();

    const isRepeatInspectionValue = Form.useWatch('isRepeatInspection', form);
    //const selectedPrevious = Form.useWatch('previousInspectionId', form)

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

        if (!current || !current.isSame(minDateTime, 'day')) {
          return {};
        }
    
        const minHours = minDateTime.hour();
        const minMinutes = minDateTime.minute();
    
        return {
          disabledHours: () => range(0, minHours),
          disabledMinutes: () => range(0, minMinutes),
        };
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
    },[Patient])

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
    },[Inspection, Patient])

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
                        label={<span style={styleOfInspectionLabel} className="inspectionLabel">Первичный осмотр</span>}
                    >
                        <Switch 
                            style={{...filterSwitchStyle}}
                        />
                    </Form.Item>
                    <span style={spanStyle}>Повторный осмотр</span>
                </Col>
            </Row>
            {
                isRepeatInspectionValue ? 
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label="Предыдущий осмотр"
                            layout="vertical"
                            name="previousInspectionId"
                        >
                            <Select 
                                style={{...textAreaStyle}} 
                                placeholder="Выберите осмотр"
                                options={inspections.map(insp => ({
                                    value: insp.id,
                                    desc: insp.date,
                                    label: changeFormatToDateAndTime(insp.date) + " " + insp.diagnosis.code + " - " + insp.diagnosis.name
                                }))}
                                onChange={handleChange}
                            />
                        </Form.Item>
                    </Col>
                </Row> : 
                null
            }
            <br/>
            
            <Row>
                <Col span={8}>
                    <Form.Item
                        layout="vertical"
                        label="Дата осмотра"
                        name="date"
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
            <br/>
            </>}
        </Card>);
}

export default DateOfInspectionAndInfoAboutPreviuos;