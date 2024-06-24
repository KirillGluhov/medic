import { AutoComplete, Card, Col, Form, FormInstance, Row, Typography } from "antd";
import { inspectionCardStyle, titleInOneBlockStyle, width100, withoutPaddingTop } from "../styles/additionalStyles";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../const/constValues";
import { request } from "http";
import { error } from "console";

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

const Diagnosis: React.FC<DiagnosisProps> = ({form}) =>
{
    const [options, setOptions] = useState<ICD[]>([]);
    const [inputValue, setInputValue] = useState('');

    const getPanelValue = (data: string) => {

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
    }
    
    
    return (<Card style={{...inspectionCardStyle}}>
        <Typography.Title style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>Диагнозы</Typography.Title>
        <Form.Item
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
        </Form.Item>
    </Card>);
}

export default Diagnosis;

/**/

    //const previousInspectionIdValue = Form.useWatch('previousInspectionId', form);