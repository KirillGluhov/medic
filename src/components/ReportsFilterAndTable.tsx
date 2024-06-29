import { Col, Empty, Flex, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cardTitle, changeMarginBottom, changeMarginTop, contentWrapper, rowJustifyBetween } from "../styles/additionalStyles";
import FilterReports, { filterType } from "./FilterReports";
import dayjs from "dayjs";
import { inRange } from "../functions/smallFunctions";
import axios from "axios";
import { baseUrl } from "../const/constValues";
import TableWithData from "./TableWithData";

const {Title} = Typography

export interface SummaryModel
{
    [key: string]: number
}

interface FilterModel
{
    start?: string,
    end?: string,
    icdRoots?: string[]
}

export interface RecordModel
{
    patientName?: string,
    patientBirthdate?: string,
    gender?: "Male" | "Female",
    visitsByRoot?: SummaryModel
}

export interface ReportModel
{
    filters?: FilterModel,
    records?: RecordModel[],
    summaryByRoot?: SummaryModel;
}

function ReportsFilterAndTable()
{
    const location = useLocation();
    const [filterValues, setFilterValues] = useState<filterType | null>(null);
    const [tableValues, setTableValues] = useState<ReportModel | null>(null);
    const [aLotOf, setALotOf] = useState(false);

    useEffect(() => {
        const splitValues = (location.search) ? location.search.split('?')[1] : "";
        const splitVariables = splitValues ? splitValues.split("&") : "";

        const objectWithFilterAndSorting = new Map<string, string | string[]>();

        let queryString = '';
        //
        console.log("1", queryString);
        //

        let start = null;
        let end = null;
        let icdRoots: string[] = [];
        //
        console.log("2", queryString);
        //

        for (let i = 0; i < splitVariables.length; i++)
        {
            const pairOfValues = splitVariables[i].split("=");
            const name = pairOfValues[0];
            const value = pairOfValues[1];

            if (name != "icdRoots")
            {
                objectWithFilterAndSorting.set(name, value);
            }
            else
            {
                const currentValue = objectWithFilterAndSorting.get(name) || [];
                const newValue = (Array.isArray(currentValue) && Array.isArray(value)) ? [...currentValue, ...value] 
                : Array.isArray(currentValue) ? [...currentValue, value]
                : Array.isArray(value) ? [currentValue, ...value]
                : [currentValue, value];

                objectWithFilterAndSorting.set(name, newValue);
            }
        }

        //
        console.log("33", objectWithFilterAndSorting);
        //

        //
        console.log("3", queryString);
        //

        const startNew = objectWithFilterAndSorting.get("start");
        let startValue = undefined;

        //
        console.log("4", queryString);
        //

        if (startNew != undefined && typeof startNew === "string")
        {
            const startDayJS = inRange(startNew) ? dayjs(startNew) : undefined;
            startValue = startDayJS;

            //
            console.log("5", queryString);
            //
        }

        //
        console.log("6", queryString);
        //

        const endNew = objectWithFilterAndSorting.get("end");
        let endValue = undefined;

        //
        console.log("7", queryString);
        //

        if (endNew != undefined && typeof endNew === "string")
        {
            const endDayJS = inRange(endNew) ? dayjs(endNew) : undefined;
            endValue = endDayJS;

            //
            console.log("8", queryString);
            //
        }

        //
        console.log("9", queryString);
        //

        if (endValue && startValue && (endValue.isAfter(startValue)))
        {
            //
            console.log("10", queryString);
            //

            if (startValue)
            {
                queryString += "&start=" + startNew;
                console.log("Starttttt", queryString);
                //
                console.log("11", queryString);
                //
            }

            if (endValue)
            {
                queryString += "&end=" + endNew;
                console.log("Enddddd", queryString);
                //
                console.log("12", queryString);
                //
            }
        }

        //
        console.log("13", queryString);
        //

        const icdRootsNew = objectWithFilterAndSorting.get("icdRoots");
        let icdRootes = [];
        let icdRootsValue = undefined;

        //
        console.log("14", queryString);
        //

        if (icdRootsNew != undefined && Array.isArray(icdRootsNew) && icdRootsNew.length > 0)
        {
            for (let i = 0; i < icdRootsNew.length; i++)
            {
                const icdRoot = icdRootsNew[i];
                if (typeof icdRoot === 'string')
                {
                    icdRootes.push(icdRootsNew[i])
                    queryString += "&icdRoots=" + icdRootsNew[i];
                }
            }

            if (icdRootes.length > 0)
            {
                icdRootsValue = icdRootes;
            }
        }

        //
        console.log("15", queryString);
        //

        const filterNew = {
            end: endValue,
            start: startValue,
            icdRoots: icdRootsValue
        }

        //
        console.log("16", queryString);
        //

        setFilterValues(filterNew);

        //
        console.log("17", queryString);
        //

        if (queryString != "" && queryString.length > 0)
        {
            //
            console.log("18", queryString);
            //
            queryString = "?" + queryString.substring(1);
            //
            console.log("19", queryString);
            //
        }

        console.log("20", queryString)

        axios.get(baseUrl + `report/icdrootsreport` + queryString, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setTableValues(response.data);
            setALotOf(false);
            /*setPageInfo(response.data.pagination);
            console.log("Page: ", response.data.pagination);
            setInspections(response.data.inspections);
            console.log("Inspections: ", response.data.inspections);*/
        })
        .catch(error => {
            console.log(error)

            if (error?.response?.data?.message === "Nullable object must have a value.")
            {
                setALotOf(true)
            }
        })
        

    },[location])

    return (
        <Flex style={{...contentWrapper}}>
            <Row style={{...rowJustifyBetween, ...changeMarginBottom, ...changeMarginTop}}>
                <Col>
                    <Title style={cardTitle}>Отчёты</Title>
                </Col>
            </Row>
            <FilterReports filters={filterValues}/>
            {
                (tableValues && !aLotOf) ? 
                <TableWithData tableValues={tableValues}/> : 
                aLotOf ? 
                <Empty description={
                    <Typography style={cardTitle}>Слишком много значений</Typography>
                }/> : 
                <Empty description={
                    <Typography style={cardTitle}>Пусто</Typography>
                }/>
            }
            {/*(inspections && pageInfo && pageInfo.current <= pageInfo.count) ? 
            <>
                <FilterBlockConsultation filterValues={filterValues}/>
                <InspectionWrapper inspections={inspections} shouldPatient={false}/>
                <Flex style={flexCenteredStyle}>
                    <PageList pageInfo={pageInfo} urlo={`/consultations/`}/>
                </Flex>
            </> : 
            (pageInfo) ? 
            <>
                <FilterBlockConsultation filterValues={filterValues}/>
                <Empty description={
                    <Typography style={cardTitle}>Нет осмотров</Typography>
                }/>
                <Flex style={flexCenteredStyle}>
                    <PageList pageInfo={pageInfo} urlo={`/consultations/`}/>
                </Flex>
            </> :
            <>
                <FilterBlockConsultation filterValues={filterValues}/>
                <Empty description={
                    <Typography style={cardTitle}>Нет такой страницы</Typography>
                }/>
                <Flex style={flexCenteredStyle}>
                    <PageList pageInfo={pageInfo} urlo={`/consultations/`}/>
                </Flex>
            </>*/}
        </Flex>);
}

export default ReportsFilterAndTable;