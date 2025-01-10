import { fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FilterCard, { FilterPropsType } from '../pages/PatientsPage/FilterCard';
import { checkForm, checkNavigateParams, clickOnSubmit, clickOnSwitch, enterInInput } from '../testHelpers/helpers';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Тестирование FilterCard', () => {
  describe('Подстановка первоначальных значений в компонент', () => {
    describe('Корректные данные', () => {
      it('Корректно отображается с правильными первоначальными значениями',function filterCard_correctInitialValues_fieldsForInputFulled(){
        const stabFilterValues: FilterPropsType = {
          name: 'Иванов',
          conclusions: ['Disease'],
          scheduledVisits: true,
          onlyMine: false,
          sorting: 'NameAsc',
          size: 10,
        };
    
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );
    
        checkForm(stabFilterValues)
      });
    
      it('Корректно отображается с несколькими заключениями в multiple select',function filterCard_correctInitialValuesWithSeveralConclusions_fieldsForInputFulled(){
        const stabFilterValues: FilterPropsType = {
          name: 'Петров',
          conclusions: ['Disease', 'Recovery'],
          scheduledVisits: false,
          onlyMine: true,
          sorting: 'NameDesc',
          size: 5,
        };
    
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );
    
        checkForm(stabFilterValues)
      });
    })

    describe('Недостающие поля в данных', () => {
      it('Нет имени',function filterCard_correctInitialValuesWithoutName_fieldsForInputFulled(){
        const stabFilterValues: FilterPropsType = {
          conclusions: ['Disease'],
          scheduledVisits: true,
          onlyMine: false,
          sorting: 'NameAsc',
          size: 10,
        };
    
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );
    
        checkForm(stabFilterValues)
      });

      it('Нет заключений',function filterCard_correctInitialValuesWithoutConclusion_fieldsForInputFulled(){
        const stabFilterValues: FilterPropsType = {
          name: 'Иванов',
          scheduledVisits: true,
          onlyMine: false,
          sorting: 'NameAsc',
          size: 10,
        };
    
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );
    
        checkForm(stabFilterValues)
      });

      it('Нет запланированных визитов',function filterCard_correctInitialValuesWithoutSchedulingVisits_fieldsForInputFulled(){
        const stabFilterValues: FilterPropsType = {
          name: 'Иванов',
          conclusions: ['Disease'],
          onlyMine: false,
          sorting: 'NameAsc',
          size: 10,
        };
    
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );
    
        checkForm(stabFilterValues)
      });

      it('Нет моих пациентов',function filterCard_correctInitialValuesWithoutMyPatients_fieldsForInputFulled(){
        const stabFilterValues: FilterPropsType = {
          name: 'Иванов',
          conclusions: ['Disease'],
          scheduledVisits: true,
          sorting: 'NameAsc',
          size: 10,
        };
    
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );
    
        checkForm(stabFilterValues)
      });

      it('Нет сортировки',function filterCard_correctInitialValuesWithoutSorting_fieldsForInputFulled(){
        const stabFilterValues: FilterPropsType = {
          name: 'Иванов',
          conclusions: ['Disease'],
          scheduledVisits: true,
          onlyMine: false,
          size: 10,
        };
    
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );
    
        checkForm(stabFilterValues)
      });

      it('Нет размера страницы',function filterCard_correctInitialValuesWithoutSize_fieldsForInputFulled(){
        const stabFilterValues: FilterPropsType = {
          name: 'Иванов',
          conclusions: ['Disease'],
          scheduledVisits: true,
          onlyMine: false,
          sorting: 'NameAsc',
        };
    
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );
    
        checkForm(stabFilterValues)
      });

      it('Нет всех полей',function filterCard_correctInitialValuesWithoutAllFields_fieldsForInputFulled(){
        const stabFilterValues: FilterPropsType = {
        };
    
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );
    
        checkForm(stabFilterValues)
      });
    })

    describe('Необычные значения полей', () => {
      describe('Имя', () => {

        it('Длинное имя',function filterCard_longName_fieldsForInputFulled(){
          const stabFilterValues: FilterPropsType = {
            name: 'A'.repeat(1_000_000),
            conclusions: ['Disease'],
            scheduledVisits: true,
            onlyMine: false,
            sorting: 'NameAsc',
            size: 10,
          };
      
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );
      
          checkForm(stabFilterValues)
        });

      })

      describe('Заключения', () => {
        it('Повторяющиеся заключения',function filterCard_repeatConclusions_fieldsForInputFulled(){
          const stabFilterValues: FilterPropsType = {
            name: 'Иванов',
            conclusions: ['Disease', 'Disease'],
            scheduledVisits: true,
            onlyMine: false,
            sorting: 'NameAsc',
            size: 10,
          };
      
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );
      
          checkForm(stabFilterValues)
        });
  
        it('Несуществующие заключения',function filterCard_nonExistConclusions_fieldsForInputFulled(){
          const stabFilterValues: FilterPropsType = {
            name: 'Иванов',
            conclusions: ['A'],
            scheduledVisits: true,
            onlyMine: false,
            sorting: 'NameAsc',
            size: 10,
          };
      
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );
      
          checkForm(stabFilterValues)
        });
      })

      describe('Сортировка', () => {
        it('Несуществующая сортировка',function filterCard_nonExistSorting_fieldsForInputFulled(){
          const stabFilterValues: FilterPropsType = {
            name: 'Иванов',
            conclusions: ['Disease'],
            scheduledVisits: true,
            onlyMine: false,
            sorting: 'A',
            size: 10,
          };
      
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );
      
          checkForm(stabFilterValues)
        });
      })

      describe('Размер страницы', () => {
        it('Равен 0',function filterCard_SizeIsEqualToZero_fieldsForInputFulled(){
          const stabFilterValues: FilterPropsType = {
            name: 'Иванов',
            conclusions: ['Disease'],
            scheduledVisits: true,
            onlyMine: false,
            sorting: 'A',
            size: 0,
          };
      
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );
      
          checkForm(stabFilterValues)
        });

        it('Отрицательный',function filterCard_SizeIsBelowZero_fieldsForInputFulled(){
          const stabFilterValues: FilterPropsType = {
            name: 'Иванов',
            conclusions: ['Disease'],
            scheduledVisits: true,
            onlyMine: false,
            sorting: 'A',
            size: -1,
          };
      
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );
      
          checkForm(stabFilterValues)
        });

        it('Не число',function filterCard_SizeisNaN_fieldsForInputFulled(){
          const stabFilterValues: FilterPropsType = {
            name: 'Иванов',
            conclusions: ['Disease'],
            scheduledVisits: true,
            onlyMine: false,
            sorting: 'A',
            size: NaN,
          };
      
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );
      
          checkForm(stabFilterValues)
        });

        it('Огромное значение',function filterCard_SizeisBig_fieldsForInputFulled(){
          const stabFilterValues: FilterPropsType = {
            name: 'Иванов',
            conclusions: ['Disease'],
            scheduledVisits: true,
            onlyMine: false,
            sorting: 'A',
            size: 1_000_000,
          };
      
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );
      
          checkForm(stabFilterValues)
        });
      })
    })
  })

  describe('Перенаправление на страницу', () => {
    const stabFilterValues: FilterPropsType = {
      name: 'Иванов',
      conclusions: ['Disease'],
      scheduledVisits: true,
      onlyMine: false,
      sorting: 'NameAsc',
      size: 10,
    };

    describe('Проверка числа перенаправлений', () => {
      it('Без перенаправления (пользователь не менял значения в форме)',async function filterCard_userDoesntChangeFieldValues_withoutNavigationToPage(){
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );
    
        clickOnSubmit()
    
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(0));
      });

      it('Лишь одно перенаправление (пользователь менял значение в форме)',async function filterCard_userChangeFieldValues_navigateToPage(){
        render(
          <BrowserRouter>
            <FilterCard filterValues={stabFilterValues} />
          </BrowserRouter>
        );

        enterInInput('Петров')
        clickOnSubmit()
    
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));
      });
    })

    describe('Проверка url страницы перенаправления', () => {
      describe('Перенаправления при вводе различных значений', () => {
        it('Менялось имя',async function filterCard_userChangedName_navigateToPage(){
          const changeValues: FilterPropsType = {
            name: 'Петров'
          }

          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );
      
          enterInInput('Петров')
          clickOnSubmit()
      
          await checkNavigateParams(changeValues, stabFilterValues, mockNavigate)
        });

        it('Менялись визиты',async function filterCard_userClickedOnScheduledSwitch_navigateToPage(){
          const changeValues: FilterPropsType = {
            scheduledVisits: false
          }
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );

          clickOnSwitch('scheduledVisits')
          clickOnSubmit()
      
          await checkNavigateParams(changeValues, stabFilterValues, mockNavigate)
        });

        it('Менялись визиты',async function filterCard_userClickedOnOnlyMineSwitch_navigateToPage(){
          const changeValues: FilterPropsType = {
            onlyMine: true
          }
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );

          clickOnSwitch('onlyMine')
          clickOnSubmit()
      
          await checkNavigateParams(changeValues, stabFilterValues, mockNavigate)
        });

        it('Менялось несколько полей сразу',async function filterCard_userchngedSeveralFields_navigateToPage(){
          const changeValues: FilterPropsType = {
            name: 'Петров',
            onlyMine: true,
            scheduledVisits: false
          }
          render(
            <BrowserRouter>
              <FilterCard filterValues={stabFilterValues} />
            </BrowserRouter>
          );

          enterInInput('Петров')
          clickOnSwitch('onlyMine')
          clickOnSwitch('scheduledVisits')
          clickOnSubmit()
      
          await checkNavigateParams(changeValues, stabFilterValues, mockNavigate)
        });


      })
    })
  })

  describe('Проверка ввода данных пользователем', () => {
    const stabFilterValues: FilterPropsType = {
      name: 'Иванов',
      conclusions: ['Disease'],
      scheduledVisits: true,
      onlyMine: false,
      sorting: 'NameAsc',
      size: 10,
    };

    it('Менялось имя',async function filterCard_userChangedName_fulledFields(){
      const changeValues: FilterPropsType = {
        name: 'Петров'
      }

      render(
        <BrowserRouter>
          <FilterCard filterValues={stabFilterValues} />
        </BrowserRouter>
      );
  
      enterInInput('Петров')
      clickOnSubmit()
  
      checkForm(stabFilterValues, changeValues)
    });

    it('Менялись визиты',async function filterCard_userClickedOnScheduledSwitch_fulledFields(){
      const changeValues: FilterPropsType = {
        scheduledVisits: false
      }
      render(
        <BrowserRouter>
          <FilterCard filterValues={stabFilterValues} />
        </BrowserRouter>
      );

      clickOnSwitch('scheduledVisits')
      clickOnSubmit()
  
      checkForm(stabFilterValues, changeValues)
    });

    it('Менялись визиты',async function filterCard_userClickedOnOnlyMineSwitch_fulledFields(){
      const changeValues: FilterPropsType = {
        onlyMine: true
      }
      render(
        <BrowserRouter>
          <FilterCard filterValues={stabFilterValues} />
        </BrowserRouter>
      );

      clickOnSwitch('onlyMine')
      clickOnSubmit()
  
      checkForm(stabFilterValues, changeValues)
    });

    it('Менялось несколько полей сразу',async function filterCard_userchngedSeveralFields_fulledFields(){
      const changeValues: FilterPropsType = {
        name: 'Петров',
        onlyMine: true,
        scheduledVisits: false
      }
      render(
        <BrowserRouter>
          <FilterCard filterValues={stabFilterValues} />
        </BrowserRouter>
      );

      enterInInput('Петров')
      clickOnSwitch('onlyMine')
      clickOnSwitch('scheduledVisits')
      clickOnSubmit()
  
      checkForm(stabFilterValues, changeValues)
    });
  })
});