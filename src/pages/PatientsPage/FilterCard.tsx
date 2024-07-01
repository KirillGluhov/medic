import { Card, Form, Row, Typography, Col, Input, Select, Switch, Button } from "antd";
import { 
    cardSizeStyle,
    filterCardStyle, 
    profileCardTitle,
    rowFilterStyle,
    filterSwitchStyle,
    filterToBotton,
    cardButtonStyle,
    boldText,
    improveColumn,
    improveColumnSecond,
    spanStyle,
} from "../../styles/additionalStyles";
import { useNavigate } from 'react-router-dom';
import { generateValues } from "../../functions/smallFunctions";
import { useEffect } from "react";
import type { FormProps } from 'antd';

const {Title} = Typography;

interface FilterCardProps
{
    filterValues: {
        name?: string;
        conclusions?: string[];
        scheduledVisits?: boolean;
        onlyMine?: boolean;
        sorting?: string;
        size?: number
    };
}

type FilterType = {
    name?: string | null,
    conclusions?: string[] | null,
    scheduledVisits?: boolean | null,
    onlyMine?: boolean | null,
    sorting?: string | null,
    size?: string | null
};

const FilterCard: React.FC<FilterCardProps> = ({filterValues}) =>
{
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {

        if (filterValues)
        {
            if (filterValues.name)
            {
                form.setFields([
                    {
                        name: "name",
                        value: filterValues.name
                    }
                ]);
            }
            else
            {
                form.setFields([
                    {
                        name: "name",
                        value: undefined
                    }
                ]);
            }

            if (filterValues.conclusions)
            {
                form.setFieldsValue({
                    conclusions: filterValues.conclusions,
                });
            }
            else
            {
                form.setFieldsValue({
                    conclusions: undefined,
                });
            }

            if (filterValues.scheduledVisits)
            {
                form.setFields([
                    {
                        name: "scheduledVisits",
                        value: filterValues.scheduledVisits
                    }
                ]);
            }
            else
            {
                form.setFields([
                    {
                        name: "scheduledVisits",
                        value: undefined
                    }
                ]);
            }

            if (filterValues.onlyMine)
            {
                form.setFields([
                    {
                        name: "onlyMine",
                        value: filterValues.onlyMine
                    }
                ]);
            }
            else
            {
                form.setFields([
                    {
                        name: "onlyMine",
                        value: undefined
                    }
                ]);
            }

            if (filterValues.sorting)
            {
                form.setFields([
                    {
                        name: "sorting",
                        value: filterValues.sorting
                    }
                ]);
            }
            else
            {
                form.setFields([
                    {
                        name: "sorting",
                        value: 'NameAsc'
                    }
                ]);
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

            console.log("125", filterValues);
        }

        console.log("126", filterValues);
    },[filterValues])

    const onFinishFailed: FormProps<FilterType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish: FormProps<FilterType>['onFinish'] = (values) => {

        console.log("127", filterValues);
        console.log("1271", values);

        let newAdress = "";

        if (values.name)
        {
            newAdress += "&name=" + values.name
        }

        if (values.conclusions)
        {
            for (let i = 0; i < values.conclusions.length; i++)
            {
                newAdress += "&conclusions=" + values.conclusions[i];
            }
        }

        if (values.scheduledVisits)
        {
            newAdress += "&scheduledVisits=" + values.scheduledVisits;
        }

        if (values.onlyMine)
        {
            newAdress += "&onlyMine=" + values.onlyMine;
        }

        if (values.sorting)
        {
            newAdress += "&sorting=" + values.sorting;
        }

        if (values.size)
        {
            newAdress += "&size=" + values.size;
        }

        if (newAdress != "")
        {
            newAdress = "?" + newAdress.substring(1);
        }

        console.log(`/patients/${newAdress}`)

        console.log("128", filterValues);
        console.log("1281", values);

        form.resetFields();

        console.log("129", filterValues);
        console.log("1291", values);

        navigate(`/patients/${newAdress}`);

        console.log("130", filterValues);
        console.log("1301", values);

        form.resetFields();
    }
    
    return (<Card style={filterCardStyle}>
        <Title style={profileCardTitle}>Фильтры и сортировка</Title>
        <br/>
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={16}>
                <Col span={12} lg={12} xs={24}>
                    <Form.Item
                        label="Имя"
                        layout="vertical"
                        name="name"
                    >
                        <Input
                            placeholder='Иванов Иван Иванович'
                            style={{...cardSizeStyle}}
                        />
                    </Form.Item>
                </Col>
                <Col span={12} lg={12} xs={24}>
                    <Form.Item
                        label="Имеющиеся заключения"
                        layout="vertical"
                        name="conclusions"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            options={[
                                { value: 'Disease', label: 'Болезнь' },
                                { value: 'Recovery', label: 'Выздоровление' },
                                { value: 'Death', label: 'Смерть' }
                            ]}
                            style={{...cardSizeStyle}}
                            placeholder="Выберите заключение"
                        >
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16} style={filterToBotton}>
                <Col span={8} xl={8} lg={12} md={12} xs={24} style={improveColumn}>
                    <Form.Item
                        name="scheduledVisits"
                        layout="horizontal"
                    >
                        <Switch 
                            style={filterSwitchStyle} 
                        />
                    </Form.Item>
                    <span style={spanStyle}>Есть запланированные визиты</span>
                </Col>
                <Col span={8} xl={8} lg={12} md={12} xs={24} style={improveColumnSecond}>
                    <Form.Item
                        name="onlyMine"
                        layout="horizontal"
                    >
                        <Switch 
                            style={filterSwitchStyle} 
                        />
                    </Form.Item>
                    <span className="myPatients" style={spanStyle}>Мои пациенты</span>
                </Col>
                <Col span={8} xl={8} lg={24} xs={24}>
                    <Form.Item
                        label="Сортировка пациентов"
                        layout="vertical"
                        name="sorting"
                    >
                        <Select
                            options={[
                                { value: 'NameAsc', label: 'По имени (А-Я)' },
                                { value: 'NameDesc', label: 'По имени (Я-А)' },
                                { value: 'CreateAsc', label: 'По дате создания (Сначала старые)' },
                                { value: 'CreateDesc', label: 'По дате создания (Сначала новые)' },
                                { value: 'CreateAsc', label: 'По дате осмотров (Сначала старые)' },
                                { value: 'CreateDesc', label: 'По дате осмотров (Сначала новые)' },
                            ]}
                            style={{...cardSizeStyle}}
                        >
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row 
                gutter={16} 
                style={rowFilterStyle}
            >
                <Col span={6} xl={6} lg={8} md={12} xs={24}>
                    <Form.Item
                    label="Число пациентов на странице"
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

export default FilterCard