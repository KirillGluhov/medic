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
    withoutMarginBottom
} from "../styles/additionalStyles";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../const/constValues";
import { DiagnosisModel, InspectionPreview } from "./InspectionWrapper";
import { findType } from "../functions/smallFunctions";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = AutoComplete;

interface DiagnosisProps
{
    form: FormInstance<any>;
}

interface ICD
{
    code: string,
    name: string,
    id: string,
    createTime: string
}

/*

export interface InspectionPreview
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
    diagnosis: DiagnosisModel,
    hasChain: boolean,
    hasNested: boolean
}

*/

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

const Diagnosis: React.FC<DiagnosisProps> = ({form}) =>
{
    const [options, setOptions] = useState<ICD[]>([]);

    const [inspectionInfo, setInspectionInfo] = useState<InspectionFull | null>(null);

    const previousInspectionId = Form.useWatch("previousInspectionId", form);

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
        const typeFirst = form.getFieldValue('typeFirst') || null;
    
        if (previousInspectionId === undefined)
        {
            const hasMain = typeFirst === 'Main' || diagnoses.some((diag: { type: string; }) => diag.type === 'Main');

            if (!hasMain) {
                return Promise.reject(new Error('Хотя бы один диагноз должен быть основным'));
            }
        }
    
        return Promise.resolve();
      };

    const handleKey = (event: any) => {
        const addValue = event.key;
        const mainValue = event.target.value;
        

        if (addValue.length > 1)
        {
            axios.get(baseUrl + 'dictionary/icd10', {
                params: {
                  page: 1,
                  size: 5,
                  request: mainValue
                }
            })
            .then(response => {
                console.log(response.data.records);
                setOptions(response.data.records);
            })
            .catch(error => {
                console.log(error);
            })
        }
        else
        {
            axios.get(baseUrl + 'dictionary/icd10', {
                params: {
                  page: 1,
                  size: 5,
                  request: mainValue + addValue
                }
            })
            .then(response => {
                console.log(response.data.records);
                setOptions(response.data.records);
            })
            .catch(error => {
                console.log(error);
            })
        }
    }
    
    
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
        <React.Fragment>
            <Form.Item
                name={'icdDiagnosisIdFirst'}
                rules={[{ required: true, message: 'Пожалуйста, выберите диагноз' }]}
            >
                <Select
                    filterOption={false}
                    showSearch
                    onSearch={getPanelValue}
                    options={options.map(option => ({
                        value: option.id,
                        label: DisplayElement(option.code + " - " + option.name),
                    }))}
                />
            </Form.Item>
            <Form.Item
                name={'descriptionFirst'}
                style={withoutMarginBottom}
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
                name={'typeFirst'}
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
                                    options={options.map(option => ({
                                        value: option.id,
                                        label: DisplayElement(option.code + " - " + option.name),
                                    }))}
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
        {/*<Form.Item
            name="icdDiagnosisId"
            rules={[{ required: true, message: 'Пожалуйста, выберите диагноз' }]}
        >
            <AutoComplete
                value={inputValue}
                onChange={getPanelValue}
                options={options.map(option => ({
                    value: option.id,
                    label: option.code + " - " + option.name
                }))}
            />
        </Form.Item>*/}
    </Card>);
}

export default Diagnosis;

/*

 

onBlur={() => {console.log("Произошёл blur")}}
                    onChange={() => {console.log("Произошёл change")}}
                    onClick={() => {console.log("Произошёл click")}}
                    onDropdownVisibleChange={() => {console.log("Произошёл dropdownvisiblechange")}}
                    onSearch={() => {console.log("Произошёл search")}}

*/

    //const previousInspectionIdValue = Form.useWatch('previousInspectionId', form);