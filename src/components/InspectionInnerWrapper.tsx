import { Row } from "antd";
import { spaceBottom } from "../styles/additionalStyles";
import InspectionCard from "./InspectionCard";
import { InspectionPreview } from "./InspectionWrapper";
import axios from "axios";
import { baseUrl } from "../const/constValues";
import { error } from "console";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface InspectionInnerProps
{
    inspection: InspectionPreview
}

const InspectionInnerWrapper: React.FC<InspectionInnerProps> = ({inspection}) =>
{
    const location = useLocation();
    const [additionalInspections, setAdditionalInspections] = useState<InspectionPreview[]>([]);
    const [selectNumber, setSelectNumber] = useState<number | null>(0);
    const [grouped, setGrouped] = useState(false);

    const handleClick = (number: number) => {
        if (selectNumber === number)
        {
            setSelectNumber(number+1);
            console.log("Selected: ", number+1);
        } 
        else 
        {
            setSelectNumber(number);
            console.log("Selected: ", number);
        }
    }

    useEffect(() => {
        if (inspection.hasNested)
        {
            axios.get(baseUrl + `inspection/${inspection.id}/chain`, 
                { 
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem("token")}` 
                    } 
                }
            )
            .then(response => {
                console.log(response);
                setAdditionalInspections(response.data);
            })
            .catch(error => {
                console.log(error);
            })
        }

        let url = ""
        
        if (location.search)
        {
            url += location.search.split("?")[1];
        }
        
        const filterAndSortingParameters = url ? url.split("&") : [];

        for (let i = 0; i < filterAndSortingParameters.length; i++)
        {
            const pairOfValues = filterAndSortingParameters[i].split("=");
            const name = pairOfValues[0];
            const value = pairOfValues[1];

            if (name === "grouped")
            {
                if (value === "true")
                {
                    setGrouped(true);
                }
                else if(value === "false")
                {
                    setGrouped(false);
                }
            }
        }
    },[inspection, location])

    return (<Row style={spaceBottom}>
        <InspectionCard 
            number={0} 
            inspection={inspection}
            onClick={() => handleClick(0)}
            currentNumber={selectNumber}
        />
        {
            grouped ?
            Array.from(additionalInspections).map((addInsp,index) => (
                <InspectionCard 
                    key={addInsp.id}
                    number={index+1} 
                    inspection={addInsp}
                    onClick={() => handleClick(index+1)}
                    hidden={selectNumber !== null && index + 1 > selectNumber}
                    currentNumber={selectNumber}
                />
            )) :
            null
        }
    </Row>)
}

export default InspectionInnerWrapper;