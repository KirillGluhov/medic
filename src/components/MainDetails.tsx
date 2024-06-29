import { Button, Card, Col, Row, Typography } from "antd";
import { DoctorModel, InspectionFull, PatientModel } from "./DetailsInspection";
import { 
    anotherForParagraph, 
    boldText, 
    deleteBottom, 
    inspectionCardStyle,
    bigTitle,
    justifySpaceAndAlignCenterStyle,
    cardSizeStyle,
    cardButtonStyle,
    smallMarginBottom
} from "../styles/additionalStyles";
import { changeFormat, changeFormatToDateAndTimeWithHyphen, chooseGender } from "../functions/smallFunctions";
import ModalInspection from "./ModalInspection";
import { useEffect, useState } from "react";

interface MainDetailsProps
{
    date: string,
    patient: PatientModel | undefined,
    doctor: DoctorModel | undefined,
    inspection: InspectionFull,
    reGet: () => void,
    showMessage: () => void,
}

const MainDetails: React.FC<MainDetailsProps> = ({date, patient, doctor, inspection, reGet, showMessage}) => {
    
    const [Me, setMe] = useState(() => {
        return localStorage.getItem("me") || ''
    })

    const [canChange, setCanChange] = useState(false);

    useEffect(() => {
        if (Me === doctor?.id)
        {
            setCanChange(true);
        }
        else
        {
            setCanChange(false);
        }
    },[Me, doctor])


    return (
        <Card style={{...inspectionCardStyle}}>
            <Row gutter={[5,5]} style={{...justifySpaceAndAlignCenterStyle, ...smallMarginBottom}}>
                <Col>
                    <Typography.Title style={bigTitle}>
                        Амбулаторный осмотр от {changeFormatToDateAndTimeWithHyphen(date)}
                    </Typography.Title>
                </Col>
                <Col>
                    {canChange ? <ModalInspection inspection={inspection} reGet={reGet} showMessage={showMessage}/> : null}
                </Col>
            </Row>
            <Typography.Paragraph style={{...boldText, ...deleteBottom}} className="paddingBottom">
                Пациент: {`${patient ? patient.name : ""}`}
            </Typography.Paragraph>
            <Typography.Paragraph
            style={deleteBottom} 
            >
                Пол: {`${patient ? chooseGender(patient.gender) : ""}`}
            </Typography.Paragraph>
            <Typography.Paragraph>
                Дата рождения: {`${(patient && patient.birthday) ? changeFormat(patient.birthday) : "Не указано"}`}
            </Typography.Paragraph>
            <Typography.Paragraph 
                style={anotherForParagraph}
            >
                Медицинский работник: {`${doctor ? doctor.name : ""}`}
            </Typography.Paragraph>
        </Card>
    );
}

export default MainDetails;