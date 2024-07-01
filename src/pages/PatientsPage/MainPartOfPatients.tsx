import { Flex, Row, Typography } from "antd";
import FilterCard from "./FilterCard";
import PatientCardWrapper from "./PatientCardWrapper";
import { 
    contentWrapper, 
    stylePatientAdd, 
    patientTitleTop,
    flexCentered,
} from "../../styles/additionalStyles";

import PageList, { Page } from "./PageList";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl } from "../../const/constValues";
import axios from "axios";
import { existTypeOfConclusion, isNatural, isNaturalNumberInRange } from "../../functions/smallFunctions";
import ModalPatient from "./ModalPatient";

const {Title} = Typography;

function MainPartOfPatients()
{
    const location = useLocation();
    const [filterValues, setFilterValues] = useState({});
    const [patients, setPatients] = useState([]);
    const [pageInfo, setPageInfo] = useState<Page | null>(null);
    
    useEffect(() => {
        console.log(location.pathname, location.search, location);
        let queryString = "";

        if (location.search === "")
        {
            queryString += "?size=5&page=1";
        }
        else
        {
            const url = location.search.split("?")[1];
            const filterAndSortingParameters = url.split("&");

            const objectWithFilterAndSorting = new Map<string, string | string[]>();

            let nameNew = null;
            let conclusionsNew: string[] = [];
            let scheduledVisitsNew = null;
            let onlyMineNew = null;
            let sortingNew = null;
            let sizeNew = null;

            for (let i = 0; i < filterAndSortingParameters.length; i++)
            {
                const pairOfValues = filterAndSortingParameters[i].split("=");
                const name = pairOfValues[0];
                const value = pairOfValues[1];

                if (name != "conclusions")
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

            const name = objectWithFilterAndSorting.get("name");
            if (name != undefined && typeof name === "string")
            {
                queryString += "&" + "name=" + decodeURIComponent(name)
                nameNew = decodeURIComponent(name)
            }

            const probableConclusions = objectWithFilterAndSorting.get("conclusions");
            const conclusions: string[] = [];
            if (probableConclusions != undefined && Array.isArray(probableConclusions) && probableConclusions.length > 0)
            {
                for (let i = 0; i < probableConclusions.length; i++)
                {
                    const conclusion = probableConclusions[i];
                    if (typeof conclusion === 'string' && existTypeOfConclusion(probableConclusions[i]))
                    {
                        conclusions.push(probableConclusions[i])
                        queryString += "&" + "conclusions=" + probableConclusions[i];
                    }
                }

                if (conclusions.length > 0)
                {
                    conclusionsNew = conclusions;
                }
            }

            if (objectWithFilterAndSorting.get("scheduledVisits") != undefined)
            {
                const trueOfFalse = (objectWithFilterAndSorting.get("scheduledVisits") === "true") ?
                true : (objectWithFilterAndSorting.get("scheduledVisits") === "false") ? 
                false : undefined

                if (trueOfFalse != undefined)
                {
                    queryString += "&" + "scheduledVisits=" + trueOfFalse;
                    scheduledVisitsNew = trueOfFalse;
                }
            }

            if (objectWithFilterAndSorting.get("onlyMine") != undefined)
            {
                const trueOfFalse = (objectWithFilterAndSorting.get("onlyMine") === "true") ?
                true : (objectWithFilterAndSorting.get("onlyMine") === "false") ? 
                false : undefined

                if (trueOfFalse != undefined)
                {
                    queryString += "&" + "onlyMine=" + trueOfFalse;
                    onlyMineNew = trueOfFalse;
                }
            }

            if (objectWithFilterAndSorting.get("sorting") != undefined)
            {
                const sortingType = (
                    objectWithFilterAndSorting.get("sorting") === "NameAsc" || 
                    objectWithFilterAndSorting.get("sorting") === "NameDesc" ||
                    objectWithFilterAndSorting.get("sorting") === "CreateAsc" ||
                    objectWithFilterAndSorting.get("sorting") === "CreateDesc" ||
                    objectWithFilterAndSorting.get("sorting") === "InspectionAsc" ||
                    objectWithFilterAndSorting.get("sorting") === "InspectionDesc"
                ) ? 
                objectWithFilterAndSorting.get("sorting") : undefined;

                if (sortingType != undefined && typeof sortingType === "string")
                {
                    queryString += "&" + "sorting=" + sortingType;
                    sortingNew = sortingType;
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
                name: nameNew,
                conclusions: conclusionsNew,
                scheduledVisits: scheduledVisitsNew,
                onlyMine: onlyMineNew,
                sorting: sortingNew,
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

        axios.get(baseUrl + "patient" + queryString, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        ).then(response => {
            console.log(response)

            setPatients(response.data.patients);
            console.log("200", response.data.patients)

            setPageInfo(response.data.pagination)
            console.log("201", response.data.pagination)
        }).catch(error => {
            console.log(error)

            
        })
    },[location])


    return <Flex style={contentWrapper}>
    <Row style={stylePatientAdd}>
        <Title style={patientTitleTop}>Пациенты</Title>
        <ModalPatient/>
    </Row>
    <Flex>
        <FilterCard filterValues={filterValues}/>
    </Flex>
    <Flex>
        <PatientCardWrapper patients={patients} pageInfo={pageInfo}/>
    </Flex>
    <Flex style={flexCentered}>
        <PageList pageInfo={pageInfo} urlo="/patients/"/>
    </Flex>
    </Flex>;
}

export default MainPartOfPatients;