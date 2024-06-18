import { Flex } from "antd";
import PatientMainInfo from "./PatientMainInfo";
import FilterBlock from "./FilterBlock";
import InspectionWrapper from "./InspectionWrapper";
import PageList from "./PageList";
import { contentWrapper } from "../styles/additionalStyles";
import { useEffect } from "react";

function CardCurrentPatient()
{
    return (<Flex style={contentWrapper}>
        <PatientMainInfo/>
        <FilterBlock/>
        {/*
        <InspectionWrapper/>
        <PageList pageInfo={{count: 5, current: 1, size: 5}}/>*/}
    </Flex>);
}

export default CardCurrentPatient;