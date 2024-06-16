import { Card, Typography } from "antd";
import { 
    filterCardStyle,
    smallTitleStyle,
    spanBlackColor,
    spanCardStyle
} from "../styles/additionalStyles";

const {Paragraph, Title} = Typography;

function PatientCard()
{
    return (<Card style={filterCardStyle}>
        <Title style={{...smallTitleStyle, ...spanBlackColor}}>Кашафутдинов Ильдар Александрович</Title>
        <p><span style={spanCardStyle}>Email - </span>ilda1999@mail.ru</p>
        <p><span style={spanCardStyle}>Пол - </span>Мужчина</p>
        <p><span style={spanCardStyle}>Дата рождения - </span>26.02.1991</p>
    </Card>);
}

export default PatientCard;