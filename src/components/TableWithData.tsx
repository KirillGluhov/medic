import { Space, Table, TableProps, Tag } from "antd";
import { smallMarginTop } from "../styles/additionalStyles";
import { RecordModel, ReportModel, SummaryModel } from "./ReportsFilterAndTable";

/*interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }

const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];*/

interface TableWithDataProps
{
    tableValues: ReportModel
}

const TableWithData: React.FC<TableWithDataProps> = ({tableValues}) =>
{
    const columns = [
        {
          title: 'Пациент/Код',
          dataIndex: 'patient',
          key: 'patient',
        },
        ...(tableValues.summaryByRoot ? 
          Object.entries(tableValues.summaryByRoot).map(([key]) => ({
            title: key,
            dataIndex: key,
            key: key,
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
            patient: `${record.patientName} ${record.gender} ${record.patientBirthdate}`,
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
            patient: "Суммарно",
            ...rootsValues
        }
    }

    const data = [
        ...(tableValues.records ? tableValues.records.map((record) => (makeAllFields(record))) : []),
        ...(tableValues.summaryByRoot ? [makeFromRootsObject(tableValues.summaryByRoot)] : [])
    ]

    /*
    {
            patient: record.patientName + " " + record.gender + " " + record.patientBirthdate,
        }
    
    */


    return <>
        {<Table columns={columns} dataSource={data} pagination={false} style={smallMarginTop}/>}
    </>;
}

export default TableWithData;