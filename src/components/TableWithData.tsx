import { Col, Row, Space, Table, TableProps, Tag, Typography } from "antd";
import { 
  boldText, 
  smallMarginTop, 
  columnStyle,
  smallMarginBottom,
  alignCenter
 } from "../styles/additionalStyles";
import { RecordModel, ReportModel, SummaryModel } from "./ReportsFilterAndTable";
import { changeFormat, chooseGenderIcon, getTitleString } from "../functions/smallFunctions";

interface TableWithDataProps
{
    tableValues: ReportModel
}

const TableWithData: React.FC<TableWithDataProps> = ({tableValues}) =>
{
    const columns = [
        {
          title: 'Пациент\\Код',
          dataIndex: 'patient',
          key: 'patient',
          fixed: true,
          width: 200,
          render: (patients: string[]) => (
            <Row style={alignCenter}>
              {patients.map((patient, index) =>(
                <Col span={index > 1 ? 24 : 'auto'}>
                {
                  index == 0 ? 
                  <Typography style={boldText}>{patient}</Typography> : 
                  index == 1 ? 
                  chooseGenderIcon(patient) : 
                  index == 2 ?
                  <Typography>{patient ? changeFormat(patient) : "Не указано"}</Typography> : 
                  <Typography style={boldText}>{patient}</Typography>
                }
                </Col>
              ))}
            </Row>
          ) 
        },
        ...(tableValues.summaryByRoot ? 
          Object.entries(tableValues.summaryByRoot).map(([key]) => ({
            title: key,
            dataIndex: key,
            key: key,
            width: 200,
          })) 
          : []
        )
    ]

    function makeAllFields(record: RecordModel)
    {
        const visitsByRoot = record.visitsByRoot ? Object.entries(record.visitsByRoot).reduce((acc: Record<string, number>, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {}) : null;
      
        return {
            patient: [`${record.patientName}`, `${record.gender}`, `${record.patientBirthdate}`],
            ...visitsByRoot,
        };
    }

    function makeFromRootsObject(summ: SummaryModel)
    {
        const rootsValues = Object.entries(summ).reduce((acc: Record<string, number>, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {})
        return {
            patient: ["Суммарно:"],
            ...rootsValues
        }
    }

    const data = [
        ...(tableValues.records ? tableValues.records.map((record) => (makeAllFields(record))) : []),
        ...(tableValues.summaryByRoot ? [makeFromRootsObject(tableValues.summaryByRoot)] : [])
    ]

    return <>
        <Table 
          className="custom-table"
          columns={columns} 
          dataSource={data} 
          pagination={false} 
          style={{...smallMarginTop, ...smallMarginBottom}}
          bordered
          scroll={{ x: '80%' }}
        />
    </>;
}

export default TableWithData;