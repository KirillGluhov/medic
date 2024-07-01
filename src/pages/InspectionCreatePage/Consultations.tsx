import { Button, Card, Col, Form, FormInstance, Input, Row, Select, Space, Switch, Typography } from "antd";
import { 
    filterSwitchStyle, 
    improveColumn, 
    inspectionCardStyle, 
    spanStyle, 
    titleInOneBlockStyle, 
    withoutPaddingTop,
    flexGrow,
    textAreaStyle,
    commentaryStyle,
    textAreaMarginTop,
    boldText,
    cardButtonStyle,
    cardSizeStyle,
    whiteText,
    autoWidth,
    withoutPadding
} from "../../styles/additionalStyles";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../const/constValues";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";

const {TextArea} = Input;

interface ConsultationsProps
{
    form: FormInstance<any>;
}

export interface Specialty {
    id: string,
    name: string,
    createTime: string
}

const Consultations: React.FC<ConsultationsProps> = ({form}) =>
{
    const isRequireConsultationValue = Form.useWatch("isRequireConsultation", form);

    const [specialities, setSpecialities] = useState<Specialty[]>([]);

    const validateUniqueSpecialities = (name: string) => (_: any, value: any) => {
        const consultations = form.getFieldValue('consultations') || [];
        const specId = form.getFieldValue('specialityIdFirst') || null;

        const specialities = consultations.map((consultation: { specialityId: any; }) => consultation.specialityId) || [];
    
        const allSpecialities = specId ? [specId, ...specialities] : specialities;
    
        if (value && allSpecialities.filter((id: any) => id === value).length > 1) {
          return Promise.reject('Специальности должны быть уникальны');
        }
        return Promise.resolve();
      };

    useEffect(() => {
        if (!isRequireConsultationValue) {
          form.resetFields(['specialityIdFirst', 'commentFirst', 'consultations']);
        }
      }, [isRequireConsultationValue, form]);

    useEffect(() => {
        axios.get(baseUrl + "dictionary/speciality", {
            params: {
              page: 1,
              size: 100
            }
        })
        .then(response => {
            console.log(response);
            setSpecialities(response.data.specialties)
        })
        .catch(error => {
            console.log(error);
        })
    },[])

    return (<Card style={{...inspectionCardStyle}}>
        <Typography.Title style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>Консультация</Typography.Title>
        <Row gutter={[16, 16]}>
            <Col style={{...improveColumn, ...autoWidth}}>
                <Form.Item
                    layout="horizontal"
                    name="isRequireConsultation"
                >
                    <Switch
                        style={{...filterSwitchStyle, ...withoutPadding}}
                    />
                </Form.Item>
                <span style={spanStyle}>Требуется консультация</span>
            </Col>
            {isRequireConsultationValue ? <Col style={{...flexGrow}}>
                <Form.Item
                    name='specialityIdFirst'
                    rules={[
                        {
                            required: true,
                            message: 'Специальность, не пуста, если требуется консультация',
                        },
                        { 
                            validator: validateUniqueSpecialities('specialityIdFirst') 

                        }
                    ]}
                >
                    <Select 
                        style={{...textAreaStyle}}
                        placeholder="Специализация консультанта"
                        options={specialities.map(spec => ({
                            value: spec.id,
                            label: spec.name
                        }))}
                    />
                </Form.Item>
            </Col> : null}
        </Row>
        {isRequireConsultationValue ? <><Space/>
        <span style={commentaryStyle}>Комментарий</span>
        <Form.Item
                name='commentFirst'
                rules={[
                    {
                        required: true,
                        message: 'Если требуются консультации, то комментарий не пустой',
                    },
                    {
                        validator(_, value) {
                            if (value && (value.length < 1 || value.length > 1000))
                            {
                                return Promise.reject('Длина комментария должна быть в диапазоне [1, 1000]');
                            }
                            return Promise.resolve();   
                        },
                    }
                ]}
        >
            <TextArea 
                rows={2} 
                style={{...textAreaStyle, ...textAreaMarginTop, resize: 'none'}}
            />
        </Form.Item>
        </> : null}
        {isRequireConsultationValue ? <Form.List name="consultations">
            {(fields, {add, remove}) => (
                <>
                    {fields.map(({key, name, ...restField}) => (
                    <>
                        <Form.Item
                            {...restField}
                            name={[name, 'specialityId']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Специальность, не пуста, если требуется консультация',
                                },
                                { 
                                    validator: validateUniqueSpecialities(`consultations[${name}].specialityId`) 
        
                                }
                            ]}
                        >
                            <Select 
                                style={{...textAreaStyle}}
                                placeholder="Специализация консультанта"
                                options={specialities.map(spec => ({
                                    value: spec.id,
                                    label: spec.name
                                }))}
                            />
                        </Form.Item>
                        <Space/>
                        <span style={commentaryStyle}>Комментарий</span>
                        <Form.Item
                                {...restField}
                                name={[name, 'comment']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Если требуются консультации, то комментарий не пустой',
                                    },
                                    {
                                        validator(_, value) {
                                            if (value && (value.length < 1 || value.length > 1000))
                                            {
                                                return Promise.reject('Длина комментария должна быть в диапазоне [1, 1000]');
                                            }
                                            return Promise.resolve();   
                                        },
                                    }
                                ]}
                                
                            >
                                <TextArea 
                                    rows={2} 
                                    style={{...textAreaStyle, ...textAreaMarginTop, resize: 'none'}}
                                />
                        </Form.Item>
                    </>
                    ))}
                    {isRequireConsultationValue ? <Form.Item>
                        <Button onClick={() => add()} style={
                            {
                                ...cardSizeStyle, 
                                ...cardButtonStyle, 
                                ...boldText,
                                ...whiteText
                            }
                        }>
                            <PlusOutlined/>Добавить консультацию
                        </Button>
                    </Form.Item> : null}
                </>
            )}
        </Form.List> : null}
    </Card>);
}

export default Consultations;