import { AutoComplete, Button, Card, Col, Form, FormInstance, Input, Radio, Row, Select, Typography } from "antd";
import { 
    inspectionCardStyle, 
    titleInOneBlockStyle, 
    width100, 
    withoutPaddingTop,
    titleSmallStyle,
    anotherForParagraph,
    anotherForParagraphStyle,
    cardSizeStyle,
    whiteText,
    boldText,
    cardButtonStyle,
    blackColorStyle,
    smallWidth,
    commentaryStyle,
    withoutMarginBottom,
} from "../styles/additionalStyles";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../const/constValues";
import { DiagnosisModel, InspectionPreview } from "./InspectionWrapper";
import { findType } from "../functions/smallFunctions";
import { PlusOutlined } from "@ant-design/icons";
import { DiagnosisFullModel } from "./DetailsInspection";
import { StrangeDiagnos } from "./ModalInspection";

const { Option } = AutoComplete;

interface DiagnosProps
{
    form: FormInstance<any>;
    previousInspectionId?: string;
    diagnosises?: StrangeDiagnos[]
}

interface ICD
{
    code: string,
    name: string,
    id: string,
    createTime: string
}

export interface InspectionFull
{
    id: string,
    createTime: string,
    previousId?: string,
    date: string,
    conclusion: string,
    doctorId: string,
    doctor: string,
    patientId: string,
    patient: string,
    diagnoses: DiagnosisModel[],
    hasChain: boolean,
    hasNested: boolean
}

const DisplayElement = (value: string) => {

    const firstSpaceIndex = value.indexOf(' ');
    return (
      <><span style={boldText}>{`${value.substring(0, firstSpaceIndex)} `}</span>{value.substring(firstSpaceIndex + 1)}</>
    );
  };

const DiagnosInfo: React.FC<DiagnosProps> = ({form, previousInspectionId, diagnosises}) =>
{
    const [options, setOptions] = useState<ICD[]>([]);

    const [inspectionInfo, setInspectionInfo] = useState<InspectionFull | null>(null);

    useEffect(() => {
        if (previousInspectionId)
        {
            axios.get(baseUrl + `inspection/${previousInspectionId}`, 
                { 
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem("token")}` 
                    } 
                }
            )
            .then(response => {
                console.log(response);
                setInspectionInfo(response.data);
            })
            .catch(error => {
                console.log(error);
            })
        }
    },[previousInspectionId])

    useEffect(() => {
        axios.get(baseUrl + 'dictionary/icd10', {
            params: {
              page: 1,
              size: 5
            }
        })
        .then(response => {
            console.log(response);
            setOptions(response.data.records);
        })
        .catch(error => {
            console.log(error);
        })
    },[])

    const getPanelValue = (data: string) => {

        console.log(data);
        axios.get(baseUrl + 'dictionary/icd10', {
            params: {
              page: 1,
              size: 5,
              request: data
            }
        })
        .then(response => {
            console.log(response);
            setOptions(response.data.records);
        })
        .catch(error => {
            console.log(error);
        })

        console.log(options);
    }

    const validateMainType = (_: any, value: any) => {
        const diagnoses = form.getFieldValue('diagnoses') || [];
    
        const hasMain = diagnoses.some((diag: { type?: string; }) => diag?.type === 'Main');

        if (!hasMain) {
            form.setFields(
              diagnoses.map((_: any, index: any) => ({
                name: ['diagnoses', index, 'type'],
                errors: ['Хотя бы один диагноз должен быть основным'],
              }))
            );
            return Promise.reject(new Error('Хотя бы один диагноз должен быть основным'));
          }
        
          form.setFields(
            diagnoses.map((_: any, index: any) => ({
              name: ['diagnoses', index, 'type'],
              errors: [],
            }))
          );
        
          return Promise.resolve();
    };
    
    return (<Card style={{...inspectionCardStyle}}>
        <Typography.Title style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>Диагнозы</Typography.Title>
        {inspectionInfo && inspectionInfo.diagnoses.map((diag, i) => (
            <React.Fragment key={i}>
                <Typography.Paragraph style={titleSmallStyle}>{`(${inspectionInfo.diagnoses[i].code}) ${inspectionInfo.diagnoses[i].name}`}</Typography.Paragraph>
                <Typography.Paragraph style={anotherForParagraph}>Тип в осмотре: {`${findType(inspectionInfo.diagnoses[i].type)}`}</Typography.Paragraph>
                <Typography.Paragraph style={anotherForParagraphStyle}>Расшифровка: {`${inspectionInfo.diagnoses[i].description}`}</Typography.Paragraph>
            </React.Fragment>
        ))}
        <span style={commentaryStyle}>Болезни</span>
        <Form.List name="diagnoses">
            {(fields, {add}) => (
                <>
                    {fields.map(({key, name, ...restField}) => (
                        <React.Fragment key={key}>
                            <Form.Item
                                name={[name, 'icdDiagnosisId']}
                                rules={[{ required: true, message: 'Пожалуйста, выберите диагноз' }]}
                            >
                                <Select
                                    filterOption={false}
                                    showSearch
                                    onSearch={getPanelValue}
                                    options={[
                                        ...options.map(option => ({
                                          value: option.id,
                                          label: DisplayElement(option.code + " - " + option.name),
                                        })),
                                        ...(diagnosises && diagnosises[key] ? [
                                          {
                                            value: diagnosises[key].icdDiagnosisId,
                                            label: DisplayElement(diagnosises[key].code + " - " + diagnosises[key].name)
                                          }
                                        ] : [])
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                style={withoutMarginBottom}
                                name={[name, 'description']}
                                rules={[
                                    {
                                        validator(_, value) {
                                            if (value && (value.length > 5000))
                                            {
                                                return Promise.reject('Длина описания должна быть не больше 5000');
                                            }
                                            return Promise.resolve();   
                                        },
                                    }
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                            <span style={commentaryStyle}>Тип диагноза в осмотре</span>
                            <Form.Item
                                style={{...withoutMarginBottom}}
                                name={[name, 'type']}
                                rules={
                                    [
                                        { 
                                            required: true, 
                                            message: 'Вы не выбрали тип' 
                                        },
                                        { 
                                            validator: validateMainType 
                                        }
                                    ]
                                }
                            >
                                <Radio.Group 
                                    style={{...blackColorStyle, ...cardSizeStyle}}
                                    buttonStyle="solid"
                                >
                                    <Radio value={"Main"}><span>Основной</span></Radio>
                                    <Radio value={"Concomitant"}>Сопутствующий</Radio>
                                    <Radio value={"Complication"}>Осложнение</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </React.Fragment>
                    ))}
                    <Form.Item>
                        <Button onClick={() => add()} style={
                            {
                                ...cardSizeStyle, 
                                ...cardButtonStyle, 
                                ...boldText,
                                ...whiteText
                            }
                        }>
                            <PlusOutlined/>Добавить диагноз
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    </Card>);
}

export default DiagnosInfo;