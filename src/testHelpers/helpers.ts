import { FilterPropsType } from "../pages/PatientsPage/FilterCard";
import { fireEvent, screen, waitFor } from '@testing-library/react';


export function chooseConclusionTitle(conclusionType: string)
{
  const conclusions = [
    { value: 'Disease', label: 'Болезнь' },
    { value: 'Recovery', label: 'Выздоровление' },
    { value: 'Death', label: 'Смерть' }
  ]

  const foundConclusion = conclusions.find(conclusion => conclusion.value === conclusionType)

  return foundConclusion?.label ?? conclusionType;
}

export function chooseSortingTitle(sortingType: string | undefined)
{
  const sortings = [
    { value: 'NameAsc', label: 'По имени (А-Я)' },
    { value: 'NameDesc', label: 'По имени (Я-А)' },
    { value: 'CreateAsc', label: 'По дате создания (Сначала старые)' },
    { value: 'CreateDesc', label: 'По дате создания (Сначала новые)' },
    { value: 'InspectionAsc', label: 'По дате осмотров (Сначала старые)' },
    { value: 'InspectionDesc', label: 'По дате осмотров (Сначала новые)' },
  ]

  const foundSorting = sortings.find(sorting => sorting.value === sortingType);

  return sortingType ? (foundSorting?.label ?? sortingType) : 'По имени (А-Я)';
}

export function getSelect(id: string)
{
  return document.getElementById(id)?.
  closest('.ant-select-selector')?.
  querySelector('.ant-select-selection-item');
}

export function stringifySize(size: number | undefined)
{
  return size ? size?.toString() : '5';
}

export function checkForm(stabFilterValues: FilterPropsType, inputValues?: FilterPropsType)
{
  const haveScheduledVisits = document.getElementById('scheduledVisits');
  const isOnlyMinePatients = document.getElementById('onlyMine');

  const avaibleConclusions = document.getElementById('conclusions')?.closest(".ant-select-selection-overflow");

  const patientsSorting = getSelect('sorting');
  const patientsCountOnPage = getSelect('size');

  if (inputValues?.name)
  {
    expect(screen.getByLabelText('Имя')).toHaveValue(inputValues?.name ?? '');
  }
  else
  {
    expect(screen.getByLabelText('Имя')).toHaveValue(stabFilterValues?.name ?? '');
  }
  
  //
  stabFilterValues?.conclusions?.forEach(conclusion => {
    const choosenConclusion = chooseConclusionTitle(conclusion);
    const choosenConclusionTag = avaibleConclusions?.querySelector(`span[title="${choosenConclusion}"]`);

    expect(choosenConclusionTag).toHaveTextContent(choosenConclusion);
    
  })

  expect(haveScheduledVisits).toHaveAttribute('aria-checked', `${
        (inputValues?.scheduledVisits !== undefined) ? 
        (inputValues?.scheduledVisits ?? false) : 
        (stabFilterValues?.scheduledVisits ?? false)
    }`);

  expect(isOnlyMinePatients).toHaveAttribute('aria-checked', `${
        (inputValues?.onlyMine !== undefined) ? 
        (inputValues?.onlyMine ?? false) : 
        (stabFilterValues?.onlyMine ?? false)
    }`);
  expect(patientsSorting).toHaveTextContent(chooseSortingTitle(
        inputValues?.sorting ? 
        inputValues?.sorting : 
        stabFilterValues?.sorting
    ));
  expect(patientsCountOnPage).toHaveTextContent(stringifySize(
        inputValues?.size ? 
        inputValues?.size : 
        stabFilterValues?.size
    ));
}

export function clickOnSubmit()
{
  const searchPatientsButton = document.querySelector('button[type="submit"]');

  if (searchPatientsButton)
  {
    fireEvent.click(searchPatientsButton);
  }
}

export function clickOnSwitch(id: string)
{
  const searchPatientsButton = document.getElementById(id);

  if (searchPatientsButton)
  {
    fireEvent.click(searchPatientsButton);
  }
}

export function enterInInput(name: string)
{
  const nameInput = screen.getByLabelText(/Имя/i);
  fireEvent.change(nameInput, { target: { value: name } });
}

export async function checkNavigateParams(params: FilterPropsType, initialValues: FilterPropsType, mockFn: jest.Mock<any, any>)
{
  await waitFor(() => {
    expect(mockFn).toBeCalledTimes(1);

    const [url] = mockFn.mock.calls[0];
    const parsedUrl = new URL(url, 'http://localhost');

    expect(parsedUrl.pathname).toBe('/patients/');

    expect(parsedUrl.searchParams.get('name')).toBe(params?.name ?? initialValues?.name);

    if (initialValues?.conclusions)
    {
      expect(parsedUrl.searchParams.getAll('conclusions')).toEqual(expect.arrayContaining(initialValues?.conclusions));
    }

    if (params?.conclusions)
    {
      expect(parsedUrl.searchParams.getAll('conclusions')).toEqual(expect.arrayContaining(params?.conclusions));
    }
  
    if (params?.onlyMine || (params?.onlyMine === undefined && initialValues?.onlyMine))
    {
      expect(parsedUrl.searchParams.get('onlyMine')).toBe('true');
    }
    else 
    {
      expect(parsedUrl.searchParams.get('onlyMine')).toBe(null);
    }

    if (params?.scheduledVisits || (params?.scheduledVisits === undefined && initialValues?.scheduledVisits))
    {
      expect(parsedUrl.searchParams.get('scheduledVisits')).toBe('true');
    }
    else
    {
      expect(parsedUrl.searchParams.get('scheduledVisits')).toBe(null);
    }

    expect(parsedUrl.searchParams.get('sorting')).toBe(params?.sorting ?? initialValues?.sorting);
    expect(parsedUrl.searchParams.get('size')).toBe(params?.size?.toString() ?? initialValues?.size?.toString());


  });
}