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

export function changeFormat(value: string)
{
    const dateWithTire = value.split("T")[0];
    const dateSplitted = dateWithTire.split("-");
    return dateSplitted[2] + "." + dateSplitted[1] + "." + dateSplitted[0];
}