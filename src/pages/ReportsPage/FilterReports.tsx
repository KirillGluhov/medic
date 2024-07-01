import { Button, Card, Col, DatePicker, Form, FormProps, Row, Select, Space } from "antd";
import { boldText, cardButtonStyle, cardSizeStyle, datePickerStyle, filterCardStyle, textAreaStyle } from "../../styles/additionalStyles";
import { tagRender } from "../ConsultationsPage/FilterBlockConsultation";
import { useEffect, useState } from "react";
import { icd10 } from "../PatientPage/CardCurrentPatient";
import axios from "axios";
import { baseUrl } from "../../const/constValues";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { existTypeOfICD } from "../../functions/smallFunctions";
import { useNavigate } from "react-router-dom";

export interface filterType
{
    start: Dayjs | undefined,
    end: Dayjs | undefined,
    icdRoots: string[] | undefined
}

interface FilterReportsProps
{
    filters: filterType | null
}

const FilterReports: React.FC<FilterReportsProps> = ({filters}) =>
{
    const [form] = Form.useForm();
    const [rootICD, setRootICD] = useState<icd10[]>([]);
    const navigate = useNavigate();

    const validateDates = (_: any, value: Dayjs | undefined) => {
        const startDate = form.getFieldValue('start');
        const endDate = form.getFieldValue('end');

        if (startDate && endDate && (startDate.isAfter(endDate))) {
          return Promise.reject('Дата с не может быть больше, чем по');
        }
        return Promise.resolve();
      };

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

    useEffect(() => {

        if (filters)
        {
            if (filters.icdRoots && rootICD)
            {
                const newICD: string[] = [];

                filters.icdRoots.forEach(root => {
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

            if (filters.start)
            {
                form.setFieldsValue({
                    start: filters.start,
                });
            }
            else
            {
                form.setFieldsValue({
                    start: undefined,
                });
            }

            if (filters.end)
            {
                form.setFieldsValue({
                    end: filters.end,
                });
            }
            else
            {
                form.setFieldsValue({
                    end: undefined,
                });
            }

        }

        console.log("2444", filters);
    },[filters, rootICD])

    const onFinish: FormProps<filterType>['onFinish'] = (values) => {
        console.log(values);

        let newAdress = "";

        if (values.icdRoots)
        {
            for (let i = 0; i < values.icdRoots.length; i++)
            {
                newAdress += "&icdRoots=" + values.icdRoots[i];
            }
        }

        if (values.end)
        {
            newAdress += "&end=" + values.end.toISOString();
        }

        if (values.start)
        {
            newAdress += "&start=" + values.start.toISOString();
        }

        if (newAdress != "")
        {
            newAdress = "?" + newAdress.substring(1);
        }

        form.resetFields();

        navigate(`/reports/${newAdress}`);

        form.resetFields();
    }

    const onFinishFailed: FormProps<filterType>['onFinishFailed'] = (errorValues) => {
        console.log(errorValues);
    }
    
    return (
        <Card style={filterCardStyle}>
            <Form
                requiredMark={false}
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={[16,16]}>
                    <Col xxl={4} lg={6} md={8} sm={12} span={12}>
                        <Form.Item
                            label="Дата с"
                            layout="vertical"
                            name="start"
                            rules={
                                [
                                    { 
                                        validator: validateDates 
                                    },
                                    {
                                        required: true,
                                        message: 'Дата с - не должна пустовать',
                                    },
                                ]
                            }
                        >
                            <DatePicker 
                                placeholder="дд.мм.гггг" 
                                format={{
                                    format: 'DD.MM.YYYY',
                                    type: 'mask',
                                }}
                                suffixIcon={<CalendarOutlined style={datePickerStyle} />}
                                minDate={dayjs('1900-01-01T00:00', 'YYYY-MM-DD HH:mm')}
                                maxDate={dayjs()}
                                style={{...textAreaStyle, ...datePickerStyle}}
                            />
                        </Form.Item>
                    </Col>
                    <Col xxl={4} lg={6} md={8} sm={12} span={12}>
                        <Form.Item
                            label="Дата по"
                            layout="vertical"
                            name="end"
                            rules={
                                [
                                    { 
                                        validator: validateDates 
                                    },
                                    {
                                        required: true,
                                        message: 'Дата по - не должна пустовать',
                                    },
                                ]
                            }
                        >
                            <DatePicker 
                                placeholder="дд.мм.гггг" 
                                format={{
                                    format: 'DD.MM.YYYY',
                                    type: 'mask',
                                }}
                                suffixIcon={<CalendarOutlined style={datePickerStyle} />}
                                minDate={dayjs('1900-01-01T00:00', 'YYYY-MM-DD HH:mm')}
                                maxDate={dayjs()}
                                style={{...textAreaStyle, ...datePickerStyle}}
                            />
                        </Form.Item>
                    </Col>
                    <Col xxl={16} lg={12} md={8} sm={24} span={24}>
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
                </Row>
                <Row>
                    <Col>
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
                            >Сохранить сводку</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}

export default FilterReports;