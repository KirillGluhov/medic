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