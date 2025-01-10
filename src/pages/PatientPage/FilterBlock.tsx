import { Button, Card, Col, Form, Radio, RadioChangeEvent, Row, Select, SelectProps, Space, Tag } from "antd";
import { 
    blackColorStyle, 
    boldText, 
    cardButtonStyle, 
    cardSizeStyle, 
    filterCardStyle, 
    rowFilterStyle, 
    displayFlex,
    smallWidth,
    darkerBlueColor
} from "../../styles/additionalStyles";
import { existTypeOfICD } from "../../functions/smallFunctions";
import { generateValues } from "../../functions/generateValues";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../const/constValues";
import { icd10 } from "./CardCurrentPatient";
import { FormProps } from "antd/lib";
import { useLocation, useNavigate } from "react-router-dom";

type TagRender = SelectProps['tagRender'];

type FilterType = {
    icdRoots?: string[] | null,
    grouped?: string | null,
    size?: string | null
};

interface FilterBlockProps
{
    filterValues: {
        icdRoots?: string[];
        grouped?: string;
        size?: number
    };
}

const tagRender: TagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color={darkerBlueColor}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginInlineEnd: 5, color: "white" }}
        >
        {label}
        </Tag>
    );
};

const FilterBlock: React.FC<FilterBlockProps> = ({filterValues}) =>
{
    const [form] = Form.useForm();
    const [radio, setradio] = useState("false");
    const [rootICD, setRootICD] = useState<icd10[]>([]);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        axios.get(baseUrl + "dictionary/icd10/roots")
        .then(response => {
            console.log(response);
            setRootICD(response.data)
        })
        .catch(error => {
            console.log(error);
        })
    },[])

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setradio(e.target.value);
    };

    useEffect(() => {

        if (filterValues)
        {
            if (filterValues.icdRoots && rootICD)
            {
                const newICD: string[] = [];

                filterValues.icdRoots.forEach(root => {
                    if (existTypeOfICD(root, rootICD))
                    {
                        newICD.push(root)
                    }
                })

                form.setFieldsValue({
                    icdRoots: newICD,
                });
            }
            else
            {
                form.setFieldsValue({
                    icdRoots: undefined,
                });
            }

            if (filterValues.grouped)
            {
                form.setFieldsValue({
                    grouped: filterValues.grouped,
                });
            }
            else
            {
                form.setFieldsValue({
                    grouped: 'false',
                });
            }

            if (filterValues.size)
            {
                form.setFields([
                    {
                        name: "size",
                        value: filterValues.size
                    }
                ]);
            }
            else
            {
                form.setFields([
                    {
                        name: "size",
                        value: '5'
                    }
                ]);
            }

        }

        console.log("2444", filterValues);
    },[filterValues, rootICD])

    const onFinishFailed: FormProps<FilterType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish: FormProps<FilterType>['onFinish'] = (values) => {
        console.log('Success:', values);

        let newAdress = "";

        if (values.icdRoots)
        {
            for (let i = 0; i < values.icdRoots.length; i++)
            {
                newAdress += "&icdRoots=" + values.icdRoots[i];
            }
        }

        if (values.grouped)
        {
            newAdress += "&grouped=" + values.grouped;
        }

        if (values.size)
        {
            newAdress += "&size=" + values.size;
        }

        if (newAdress != "")
        {
            newAdress = "?" + newAdress.substring(1);
        }

        console.log(`/patient/${location.pathname.split("/")[2]}/${newAdress}`)

        form.resetFields();

        console.log("129", filterValues);
        console.log("1291", values);

        navigate(`/patient/${location.pathname.split("/")[2]}/${newAdress}`);

        console.log("130", filterValues);
        console.log("1301", values);

        form.resetFields();
    };

    return (<Card style={filterCardStyle}>
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={16}>
                <Col span={12} lg={12} xs={24}>
                    <Form.Item
                        label="МКБ-10"
                        layout="vertical"
                        name="icdRoots"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            options={rootICD.map(ICD => ({
                                value: ICD.id,
                                desc: ICD.code + " " + ICD.name,
                                label: ICD.code
                            }))}
                            optionRender={(option) => (
                                <Space>
                                  {option.data.desc}
                                </Space>
                            )}
                            tagRender={tagRender}
                            placeholder="Выбрать"
                            maxTagCount='responsive'

                        >
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12} lg={12} xs={24} 
                style={displayFlex}
                >
                    <Form.Item
                        layout="vertical"
                        name="grouped"
                        label=" "
                    >
                        <Radio.Group 
                        onChange={onChange}
                            value={radio}
                            style={{...blackColorStyle, ...cardSizeStyle}}
                            buttonStyle="solid"
                        >
                            <Radio value={"true"}><span style={smallWidth}>Сгрупировать по повторным</span></Radio>
                            <Radio value={"false"}>Показать все</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Row 
                gutter={16} 
                style={rowFilterStyle}
            >
                <Col span={6} xl={6} lg={8} md={12} xs={24}>
                    <Form.Item
                    label="Число осмотров на странице"
                    layout="vertical"
                    name="size"
                    >
                        <Select
                            showSearch
                            style={{...cardSizeStyle}}
                            options={
                                generateValues(1, 100)
                            }
                        >
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6} xl={6} lg={8} md={12} xs={24}>
                    <Form.Item>
                    <Button
                        htmlType='submit' 
                        block
                        type='primary'
                        style={
                            {
                                ...cardSizeStyle, 
                                ...cardButtonStyle, 
                                ...boldText
                            }
                        }
                    >Поиск</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </Card>)
}

export default FilterBlock;