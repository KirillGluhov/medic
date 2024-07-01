import { Card, Typography } from "antd";
import { 
    anotherForParagraph, 
    inspectionCardStyle, 
    smallMarginBottom, 
    smallestMarginBottom, 
    titleInOneBlockStyle, 
    titleSmallStyle, 
    withoutPaddingTop
} from "../../styles/additionalStyles";
import { InspectionConsultationModel } from "./DetailsInspection";
import React from "react";
import CommentsWrapper from "./CommentsWrapper";

interface CommentsProps
{
    consultations?: InspectionConsultationModel[]
}

const Comments: React.FC<CommentsProps> = ({consultations}) => 
{
    return (<Card style={{...inspectionCardStyle}}>
        <Typography.Title className="paddingBottom" style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>
            Консультация
        </Typography.Title>
        {consultations && consultations.map((cons, i) => (
            <React.Fragment key={i}>
                <Typography.Paragraph 
                    style={{...titleSmallStyle, ...smallestMarginBottom}}
                >
                    Консультант: {cons.rootComment?.author?.name}
                </Typography.Paragraph>
                <Typography.Paragraph 
                    style={{...anotherForParagraph, ...smallMarginBottom}}
                >
                    Специализация консультанта: {cons.speciality?.name}
                </Typography.Paragraph>
                <CommentsWrapper consultation={cons}/>
            </React.Fragment>
        ))}
    </Card>);
}

export default Comments;