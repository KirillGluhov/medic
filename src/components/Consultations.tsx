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
    marginBottomMedium,
    commentaryStyle,
    textAreaMarginTop,
    boldText,
    cardButtonStyle,
    cardSizeStyle,
    whiteText,
    autoWidth,
    withoutPadding
} from "../styles/additionalStyles";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../const/constValues";

const {TextArea} = Input;

interface ConsultationsProps
{
    form: FormInstance<any>;
}

interface Specialty {
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
    
        const allSpecialities = [specId, ...specialities];
    
        if (value && allSpecialities.filter(id => id === value).length > 1) {
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


/*

<Row gutter={[16,16]}>
            <Col style={improveColumn}>
                <Form.Item
                    layout="horizontal"
                    name="isRequireConsultation"
                >
                    <Switch
                        style={{...filterSwitchStyle}}
                    />
                </Form.Item>
                <span style={spanStyle}>Требуется консультация</span>
            </Col>
            <Col style={{...flexGrow, }}>
                <Form.Item
                    name="consultationFirstSpecialization"
                    required
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
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col span={24} style={marginBottomMedium}>
                <Form.Item
                    layout="vertical"
                    label="Комментарий"
                    name="consultationFirstCommentary"
                    rules={[
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
                        style={textAreaStyle}
                    />
                </Form.Item>
            </Col>
            <Space/>
            <Col span={24}>
                <Form.Item>
                    <Button>
                        <PlusOutlined/>Добавить консультацию
                    </Button>
                </Form.Item>
            </Col>
        </Row>

*/




/*
options={rootICD.map(ICD => ({
                                value: ICD.id,
                                desc: ICD.code + " " + ICD.name,
                                label: ICD.code
                            }))}

*/

/*
{<Form.List 
                name="consultations"
            >
                {(fields, { add }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name, 'first']}
                                rules={[{ required: true, message: 'Missing first name' }]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'last']}
                                rules={[{ required: true, message: 'Missing last name' }]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add field
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>}

{
                isRequireConsultationValue ? 
                <Form.List name="consultations">
                    {(fields, {add}) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                            <Col>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'specialityId']}
                                    rules={
                                        [
                                            { 
                                                required: true, 
                                                message: 'Специальность не может быть пустой' 
                                            }
                                        ]
                                    }
                                >
                                    <Select placeholder="Специализация консультанта" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'comment']}
                                    rules={
                                        [
                                            { 
                                                required: true, 
                                                message: 'Комментарий не должен быть пустым' 
                                            }
                                        ]
                                    }
                                >
                                    <TextArea/>
                                </Form.Item>
                            </Col>
                            ))}
                            <Form.Item>
                            <Button 
                                type="primary" 
                                onClick={() => add()} 
                                icon={<PlusOutlined />}
                            >
                            Добавить консультацию
                            </Button>
                        </Form.Item>
                        </>
                    )}
                </Form.List> : 
                null
            }
*/