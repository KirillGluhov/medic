import { Card, Typography } from "antd";
import { DiagnosisFullModel } from "./DetailsInspection";
import { 
    anotherForParagraph, 
    anotherForParagraphStyle, 
    inspectionCardStyle, 
    smallMarginBottom, 
    titleInOneBlockStyle, 
    titleSmallStyle, 
    withoutPaddingTop,
    smallestMarginBottom
} from "../styles/additionalStyles";
import React from "react";
import { findType } from "../functions/smallFunctions";

interface DiagnosProps
{
    diagnoses: DiagnosisFullModel[] | undefined
}

const Diagnos: React.FC<DiagnosProps> = ({diagnoses}) =>
{
    
    return (
        <Card style={{...inspectionCardStyle}}>
            <Typography.Title style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>Диагнозы</Typography.Title>
            {diagnoses && diagnoses.map((diag, i) => (
                <React.Fragment key={i}>
                    <Typography.Paragraph style={{...titleSmallStyle, ...smallestMarginBottom}}>{`(${diagnoses[i].code}) ${diagnoses[i].name}`}</Typography.Paragraph>
                    <Typography.Paragraph style={anotherForParagraph}>Тип в осмотре: {`${findType(diagnoses[i].type)}`}</Typography.Paragraph>
                    <Typography.Paragraph style={anotherForParagraphStyle}>Расшифровка: {`${diagnoses[i].description}`}</Typography.Paragraph>
                </React.Fragment>
            ))}
        </Card>
    );
}
    
export default Diagnos;