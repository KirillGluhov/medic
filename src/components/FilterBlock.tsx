import { Button, Card, Col, Form, Input, Radio, Row, Select, SelectProps, Switch, Tooltip } from "antd";
import { 
    blackColorStyle, 
    boldText, 
    cardButtonStyle, 
    cardSizeStyle, 
    filterCardStyle, 
    filterSwitchStyle, 
    filterToBotton, 
    improveColumn, 
    improveColumnSecond, 
    notRounded, 
    rowFilterStyle, 
    spanStyle,
    deleteMarginBottom,
    headerColStyle
} from "../styles/additionalStyles";
import { generateValues } from "../functions/smallFunctions";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../const/constValues";
import { error } from "console";

interface icd10
{
    code: string,
    name: string,
    id: string,
    createTime: string
}

function FilterBlock()
{
    const [form] = Form.useForm();
    const [rootICD, setRootICD] = useState<icd10[]>([]);

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

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
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
                                label: ICD.code + " " + ICD.name
                            }))}
                            placeholder="Выбрать"
                            maxTagCount='responsive'

                        >
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12} lg={12} xs={24} 
                >
                    <Form.Item
                        layout="vertical"
                        name="grouped"
                        style={{...deleteMarginBottom}}
                    >
                        <Radio.Group 
                            options={[
                                { label: 'Сгрупировать по повторным', value: 'true' },
                                { label: 'Показать все', value: 'false' },
                            ]}
                            style={{...blackColorStyle, ...cardSizeStyle}}
                        />
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