import { Card, Form, Row, Typography, Col, Input, Select, Switch, Button, InputNumber } from "antd";
import { 
    cardSizeStyle,
    cardTitle, 
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
    spanCardStyle
} from "../styles/additionalStyles";
import { useLocation } from 'react-router-dom';
import { generateValues } from "../functions/smallFunctions";
import { useEffect } from "react";

const {Paragraph, Title} = Typography;

function FilterCard()
{
    const location = useLocation();
    const [form] = Form.useForm();

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = (values: any) => {
        console.log("Values: ", values)
    }

    useEffect(() => {
        console.log(location.pathname, location.search, location);

        if (location.search === "")
        {
            //размер = 5, с первой страницы
        }
        else
        {
            const url = location.search.split("?")[1];
            const filterAndSortingParameters = url.split("&");
            console.log(filterAndSortingParameters);

            const objectWithFilterAndSorting = new Map<string, string | string[]>();

            for (let i = 0; i < filterAndSortingParameters.length; i++)
            {
                const pairOfValues = filterAndSortingParameters[i].split("=");
                const name = pairOfValues[0];
                const value = pairOfValues[1];

                if (name != "conclusions")
                {
                    objectWithFilterAndSorting.set(name, value);
                }
                else
                {
                    const currentValue = objectWithFilterAndSorting.get(name) || [];
                    const newValue = (Array.isArray(currentValue) && Array.isArray(value)) ? [...currentValue, ...value] 
                    : Array.isArray(currentValue) ? [...currentValue, value]
                    : Array.isArray(value) ? [currentValue, ...value]
                    : [currentValue, value];

                    objectWithFilterAndSorting.set(name, newValue);
                }
            }

            console.log(objectWithFilterAndSorting)
        }
    },[location])
    
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
                            defaultValue="NameAsc"
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
                                generateValues(1, 50)
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