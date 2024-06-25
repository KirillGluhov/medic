import axios from "axios";
import { icd10 } from "../components/CardCurrentPatient";
import { baseUrl } from "../const/constValues";

export function chooseErrorMessage(errorMessage: string)
{
    switch (errorMessage) {
        case "Login failed":
            return "Ошибка входа"
        default:
            return errorMessage;
    }
}

export function generateValues(start: number, end: number)
{
    return Array.from({ length: end - start + 1 }, (_, i) => {
        const value = (start + i).toString();
        return { value, label: value };
    });
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