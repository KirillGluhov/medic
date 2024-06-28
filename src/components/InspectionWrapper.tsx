import { Button, Col, Collapse, Row } from "antd";
import InspectionCard from "./InspectionCard";
import { 
    rowTopStyle, 
    width100, 
    patientFlexCentered, 
    spaceBottom, 
    headerWrapperForTitle, 
    headerColStyle,
    colColStyle
} from "../styles/additionalStyles";
import { MinusOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import InspectionInnerWrapper from "./InspectionInnerWrapper";

export interface DiagnosisModel
{
    id: string,
    createTime: string,
    code: string,
    name: string,
    description?: string,
    type: string
}

export interface InspectionPreview
{
    id: string,
    createTime: string,
    previousId?: string,
    date: string,
    conclusion: string,
    doctorId: string,
    doctor: string,
    patientId: string,
    patient: string,
    diagnosis: DiagnosisModel,
    hasChain: boolean,
    hasNested: boolean
}

interface InspectionWrapperProps
{
    inspections: InspectionPreview[];
    shouldPatient: boolean
}

const InspectionWrapper: React.FC<InspectionWrapperProps> = ({inspections, shouldPatient}) =>
{
    return (
        <Row gutter={[16, 0]} style={{...rowTopStyle, ...width100, ...patientFlexCentered}}>
            <Col xs={24} xl={12}>
                {
                    Array.from(inspections).map((inspection, index) => (
                        (index % 2 == 0) ? 
                        <InspectionInnerWrapper inspection={inspection} key={inspection.id} shouldPatient={shouldPatient}/>
                        : null
                    ))
                }
            </Col>
            <Col xs={24} xl={12}>
                {
                    Array.from(inspections).map((inspection, index) => (
                        (index % 2 == 1) ? 
                        <InspectionInnerWrapper inspection={inspection} key={inspection.id} shouldPatient={shouldPatient}/>
                        : null
                    ))
                }
            </Col>
        </Row>
    );
}

export default InspectionWrapper;