import axios from "axios";
import { icd10 } from "../pages/PatientPage/CardCurrentPatient";
import { baseUrl } from "../const/constValues";
import { Consultation, Diagnoses } from "../pages/InspectionCreatePage/CreationInspectionFormWrapper";
import dayjs from "dayjs";
import { ManOutlined, WomanOutlined } from "@ant-design/icons";
import { genderMainStyle } from "../styles/additionalStyles";

export function chooseErrorMessage(errorMessage: string)
{
    switch (errorMessage) {
        case "Login failed":
            return "Ошибка входа"
        default:
            return errorMessage;
    }
}

export function isNaturalNumberInRange(value: string, min: number, max: number)
{
    const number = parseInt(value, 10);
    return !isNaN(number) && number >= min && number <= max && number.toString() === value;
}

export function isNatural(value: string)
{
    const number = parseInt(value, 10);
    return !isNaN(number) && number >= 1 && Number.isInteger(number);
}

export function existTypeOfConclusion(value: string)
{
    switch (value) {
        case "Disease":
            return true;
        case "Recovery":
            return true;
        case "Death":
            return true;
        default:
            return false;
    }
}

export function chooseConclusion(value: string)
{
    switch (value) {
        case "Disease":
            return "болезнь";
        case "Recovery":
            return "восстановление";
        case "Death":
            return "смерть";
        default:
            return "";
    }
}

export function chooseConclusionUpper(value: string)
{
    switch (value) {
        case "Disease":
            return "Болезнь";
        case "Recovery":
            return "Восстановление";
        case "Death":
            return "Смерть";
        default:
            return "";
    }
}

export function existTypeOfICD(value: string, icds: icd10[])
{
    for (let i = 0; i < icds.length; i++)
    {
        if (value === icds[i].id)
        {
            return true;
        }
    }

    return false;
}

export function changeFormat(value: string)
{
    const dateWithTire = value.split("T")[0];
    const dateSplitted = dateWithTire.split("-");
    return dateSplitted[2] + "." + dateSplitted[1] + "." + dateSplitted[0];
}

export function makeSmaller(value: string)
{
    return value.toLowerCase();
}

export function changeFormatToDateAndTime(value: string)
{
    const allDate = value.split("T");

    const datePart = allDate[0];
    const timePart = allDate[1];

    const dateSplit = datePart.split("-");
    const timeSplit = timePart.split(":");

    return dateSplit[2] + "." + dateSplit[1] + "." + dateSplit[0] + " " + timeSplit[0] + ":" + timeSplit[1];
}

export function changeFormatToDateAndTimeWithHyphen(value: string)
{
    const allDate = value.split("T");

    const datePart = allDate[0];
    const timePart = allDate[1];

    const dateSplit = datePart.split("-");
    const timeSplit = timePart.split(":");

    return dateSplit[2] + "." + dateSplit[1] + "." + dateSplit[0] + " - " + timeSplit[0] + ":" + timeSplit[1];
}

export function deleteLastSemicolon(value: string)
{
    const lastIndex = value.lastIndexOf(':');

    return lastIndex != -1 ? value.substring(0, lastIndex) : value;
}

export function findType(value: string)
{
    switch (value) {
        case "Main":
            return "основой"
        case "Concomitant":
            return "сопутствующий"
        case "Complication":
            return "осложнение"
        default:
            return value;
    }
}

export function collectDiagnoses(
    diagnoses: Diagnoses[], 
    icdDiagnosisId: string, 
    description: string | undefined, 
    type: "Main" | "Concomitant" | "Complication"
)
{
    if (!diagnoses)
    {
        return [{
            icdDiagnosisId: icdDiagnosisId,
            description: description,
            type: type
        }];
    }
    else
    {
        const diags = diagnoses;
        diags.unshift({
            icdDiagnosisId: icdDiagnosisId,
            description: description,
            type: type
        })
        return diags;
    }
}

export function collectConsultations(
    consultations: Consultation[] | undefined, 
    specialityId: string | undefined, 
    comment: string | undefined
)
{
    if (!specialityId || !comment)
    {
        return null;
    }
    else if (!consultations)
    {
        return [{
            specialityId: specialityId,
            comment: {
                content: comment
            }
        }]
    }
    else
    {
        const cons = [{
            specialityId: specialityId,
            comment: {
                content: comment
            }
        }]

        const newConsultations = consultations.map(item => ({
            specialityId: item.specialityId,
            comment: {
                content: item.comment
            }
        }))

        return newConsultations.concat(cons);
    }
}

export function chooseGender(value: string)
{
    switch (value) {
        case "Female":
            return "женский";
        case "Male":
            return "мужской";
        default:
            return "";
    }
}

export function inRange(date: string)
{
    const dateJS = dayjs(date);

    if (dateJS.isAfter(dayjs('1900-01-01')) && (dateJS.isBefore(dayjs()) || dateJS.isSame(dayjs())))
    {
        return true;
    }
    else
    {
        return false;
    }
}

export function chooseGenderIcon(value: string)
{
    switch (value) {
        case "Male":
            return <WomanOutlined style={genderMainStyle}/>
        case "Female":
            return <ManOutlined style={genderMainStyle}/>
        default:
            return <div></div>
    }
}

export function getTitleString(start: string | undefined, end: string | undefined)
{
    if (start && end)
    {
        return `Данные с ${changeFormat(start)} по ${changeFormat(end)}`;
    }
    return "";
}

export async function getDiagnosId(description: string): Promise<string | null>
{
    const code = description;
    console.log("Coooode", code);

    try 
    {
        const response = await axios.get(baseUrl + `dictionary/icd10?request=${code}&page=1&size=5`);
        console.log("uuuurl", baseUrl + `dictionary/icd10?request=${code}&page=1&size=5`)
        const records = response.data.records;
        console.log("Recccccords", records);
        return (Array.isArray(records) && records.length > 0) ? response.data.records[0].id : null;
    } 
    catch (error) 
    {
        console.error(error);
        return null;
    }
    
}