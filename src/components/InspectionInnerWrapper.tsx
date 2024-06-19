import { Row } from "antd";
import { spaceBottom } from "../styles/additionalStyles";
import InspectionCard from "./InspectionCard";
import { InspectionPreview } from "./InspectionWrapper";

interface InspectionInnerProps
{
    inspection: InspectionPreview
}

const InspectionInnerWrapper: React.FC<InspectionInnerProps> = ({inspection}) =>
{
    return (<Row style={spaceBottom}>
        <InspectionCard number={0} inspection={inspection}/>
    </Row>)
}

export default InspectionInnerWrapper;