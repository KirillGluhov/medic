import { Card, Typography } from "antd";
import { 
    cursorPointerStyle,
    filterCardStyle,
    smallTitleStyle,
    spanBlackColor,
    spanCardStyle
} from "../styles/additionalStyles";
import { Patient } from "./PatientCardWrapper";
import { changeFormat } from "../functions/smallFunctions";
import { useNavigate } from "react-router-dom";

interface PatientsCardProps
{
    patient: Patient;
}

const {Paragraph, Title} = Typography;

const PatientCard: React.FC<PatientsCardProps> = ({patient}) =>
{
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/patient/${patient.id}`)
    }

    return (<Card style={{...filterCardStyle, ...cursorPointerStyle}} onClick={handleClick}>
        <Title style={{...smallTitleStyle, ...spanBlackColor}}>{patient.name}</Title>
        <p><span style={spanCardStyle}>Пол - </span>{
            (patient.gender == "Male") ? 
            "Мужчина" : 
            (patient.gender == "Female") ? 
            "Женщина" : 
            null
        }</p>
        <p><span style={spanCardStyle}>Дата рождения - </span>{patient.birthday ? changeFormat(patient.birthday) : "Не указано"}</p>
    </Card>);
}

export default PatientCard;