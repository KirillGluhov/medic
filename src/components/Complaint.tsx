import { Card, Form, Input, Typography } from "antd";
import { 
    filterCardStyle, 
    titleInOneBlockStyle,
    withoutPaddingTop,
    textAreaStyle,
    inspectionCardStyle,
    arialText
} from "../styles/additionalStyles";
import React from "react";

const { TextArea } = Input;

interface ComplaintProps
{
    text: string | undefined,
    title: string
}

const Complaint: React.FC<ComplaintProps> = ({text, title}) =>
{
    return (<Card style={{...inspectionCardStyle}} >
        <Typography.Title className="paddingBottom" style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>{title}</Typography.Title>
        <Typography style={arialText}>{text}</Typography>
    </Card>)
}

export default Complaint;