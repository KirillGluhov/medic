import { Card, Typography } from "antd";
import { InspectionConsultationModel } from "./DetailsInspection";
import { 
    anotherForParagraph, 
    inspectionCardStyle, 
    smallMarginBottom, 
    titleInOneBlockStyle, 
    titleSmallStyle, 
    withoutPaddingTop,
    smallestMarginBottom
} from "../../styles/additionalStyles";
import React from "react";

interface DiagnosProps
{
    consultations?: InspectionConsultationModel[]
}

const ConsultationsList: React.FC<DiagnosProps> = ({consultations}) =>
{
    
    return (
        <Card style={{...inspectionCardStyle}}>
            <Typography.Title className="paddingBottom" style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>Консультация</Typography.Title>
            {consultations && consultations.map((cons, i) => (
                <React.Fragment key={i}>
                    <Typography.Paragraph style={{...titleSmallStyle, ...smallestMarginBottom}}>Консультант: {cons.rootComment?.author?.name}</Typography.Paragraph>
                    <Typography.Paragraph style={{...anotherForParagraph, ...smallMarginBottom}}>Специализация консультанта: {cons.speciality?.name}</Typography.Paragraph>
                </React.Fragment>
            ))}
        </Card>
    );
}
    
export default ConsultationsList;