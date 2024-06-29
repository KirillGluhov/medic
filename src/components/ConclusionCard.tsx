import React from "react";
import { 
    arialText, 
    inspectionCardStyle, 
    titleInOneBlockStyle, 
    withoutPaddingTop,
    boldText,
    smallMarginBottom
} from "../styles/additionalStyles";
import { Card, Typography } from "antd";
import { changeFormat, changeFormatToDateAndTime, chooseConclusion, chooseConclusionUpper } from "../functions/smallFunctions";

interface ConclusionCardProps
{
    conclusion: "Disease" | "Recovery" | "Death" | undefined,
    death: string | undefined,
    nextVisit: string | undefined
}

const ConclusionCard: React.FC<ConclusionCardProps> = ({conclusion, death, nextVisit}) =>
{
    return (<Card style={{...inspectionCardStyle}} >
        <Typography.Title className="paddingBottom" style={{...titleInOneBlockStyle, ...withoutPaddingTop}}>Заключение</Typography.Title>
        <Typography style={{...boldText, ...smallMarginBottom}}>{conclusion ? chooseConclusionUpper(conclusion) : ""}</Typography>
        {
            conclusion === "Death" ? 
            <Typography style={{...arialText}}>{`Дата смерти: ${death ? changeFormatToDateAndTime(death) : ""}`}</Typography> : 
            conclusion === "Disease" ? 
            <Typography style={{...arialText}}>{`Дата следующего визита: ${nextVisit ? changeFormatToDateAndTime(nextVisit) : ""}`}</Typography> : 
            null
        }
    </Card>)
}

export default ConclusionCard;