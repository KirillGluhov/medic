import { Col, Empty, Flex, Row, Typography } from "antd";
import InspectionWrapper from "../PatientPage/InspectionWrapper";
import PageList, { Page } from "../PatientsPage/PageList";
import { cardTitle, changeMarginBottom, changeMarginTop, contentWrapper, flexCenteredStyle, rowJustifyBetween } from "../../styles/additionalStyles";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../const/constValues";
import { isNatural, isNaturalNumberInRange } from "../../functions/smallFunctions";
import FilterBlockConsultation from "./FilterBlockConsultation";

const {Title} = Typography;

export interface icd10
{
    code: string,
    name: string,
    id: string,
    createTime: string
}

function ConsultationCard()
{
    const location = useLocation();
    const [filterValues, setFilterValues] = useState({});
    const [pageInfo, setPageInfo] = useState<Page | null>(null);
    const [inspections, setInspections] = useState([]);

    useEffect(() => {

        let queryString = "";
        let id = location.pathname.split("/")[2];

        if (location.search === "")
        {
            queryString += "?size=5&page=1";
        }
        else
        {
            const url = location.search.split("?")[1];
            const filterAndSortingParameters = url.split("&");

            const objectWithFilterAndSorting = new Map<string, string | string[]>();

            let groupedNew = null;
            let icdRootsNew: string[] = [];
            let sizeNew = null;

            for (let i = 0; i < filterAndSortingParameters.length; i++)
            {
                const pairOfValues = filterAndSortingParameters[i].split("=");
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

            const probableICDs = objectWithFilterAndSorting.get("icdRoots");
            const icds: string[] = [];
            if (probableICDs != undefined && Array.isArray(probableICDs) && probableICDs.length > 0)
            {
                for (let i = 0; i < probableICDs.length; i++)
                {
                    const conclusion = probableICDs[i];
                    if (typeof conclusion === 'string')
                    {
                        icds.push(probableICDs[i])
                        queryString += "&" + "icdRoots=" + probableICDs[i];
                    }
                }

                if (icds.length > 0)
                {
                    icdRootsNew = icds;
                }
            }

            if (objectWithFilterAndSorting.get("grouped") != undefined)
            {
                const trueOfFalse = (objectWithFilterAndSorting.get("grouped") === "true") ?
                "true" : (objectWithFilterAndSorting.get("grouped") === "false") ? 
                "false" : undefined

                if (trueOfFalse != undefined)
                {
                    queryString += "&" + "grouped=" + trueOfFalse;
                    groupedNew = trueOfFalse;
                }
            }

            const probablySize = objectWithFilterAndSorting.get("size");
            if (probablySize !== undefined && typeof probablySize === "string")
            {
                const size = isNaturalNumberInRange(probablySize, 1, 100) ? parseInt(probablySize, 10) : undefined

                if (size != undefined)
                {
                    queryString += "&" + "size=" + size;
                    sizeNew = size;
                }
                else
                {
                    queryString += "&" + "size=5";
                }
            }

            const probablyPage = objectWithFilterAndSorting.get("page");
            if (probablyPage != undefined && typeof probablyPage === "string")
            {
                const pageNumber = isNatural(probablyPage) ? parseInt(probablyPage, 10) : undefined
                if (pageNumber != undefined)
                {
                    queryString += "&" + "page=" + objectWithFilterAndSorting.get("page");
                }
                else
                {
                    queryString += "&" + "page=1";
                }
            }

            const filterNew = {
                grouped: groupedNew,
                icdRoots: icdRootsNew,
                size: sizeNew
            }

            setFilterValues(filterNew)

            if (queryString != "" && queryString.length > 0)
            {
                queryString = "?" + queryString.substring(1);
            }
            else
            {
                queryString = "?size=5&page=1";
            }

            console.log("query: ", queryString);

            console.log(objectWithFilterAndSorting) 
        }

        axios.get(baseUrl + `consultation` + queryString, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setPageInfo(response.data.pagination);
            console.log("Page: ", response.data.pagination);
            setInspections(response.data.inspections);
            console.log("Inspections: ", response.data.inspections);
        })
        .catch(error => {
            console.log(error)
        })

    },[location])
    
    return (
    <Flex style={{...contentWrapper}}>
        <Row style={{...rowJustifyBetween, ...changeMarginBottom, ...changeMarginTop}}>
            <Col>
                <Title style={cardTitle}>Консультации</Title>
            </Col>
        </Row>
        {(inspections && pageInfo && pageInfo.current <= pageInfo.count) ? 
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
        </>}
    </Flex>);
}

export default ConsultationCard;