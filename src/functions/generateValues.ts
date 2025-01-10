export function generateValues(start: number, end: number)
{
    return Array.from({ length: end - start + 1 }, (_, i) => {
        const value = (start + i).toString();
        return { value, label: value };
    });
}