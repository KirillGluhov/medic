import { Button, Flex } from "antd";
import { flexGapStyle } from "../../styles/additionalStyles";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Typography from "antd/es/typography/Typography";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface Page
{
    count: number,
    current: number,
    size: number
}

interface PageListProps
{
    pageInfo: Page | null,
    urlo: string
}

const PageList: React.FC<PageListProps> = ({pageInfo, urlo}) =>
{
    const [current, setCurrent] = useState(1);
    const [all, setAll] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        if (pageInfo)
        {
            setCurrent(pageInfo.current);
            setAll(pageInfo.count);
        }
        console.log("PageList: ", pageInfo);

    },[pageInfo])

    const changePage = (pageNumber: number) => {
        let url = ""
        
        if (location.search)
        {
            url += location.search.split("?")[1];
        }
        console.log("URL:", url);
        
        const filterAndSortingParameters = url ? url.split("&") : [];

        let newUrl = "";

        for (let i = 0; i < filterAndSortingParameters.length; i++)
        {
            const pairOfValues = filterAndSortingParameters[i].split("=");
            const name = pairOfValues[0];
            const value = pairOfValues[1];

            if (name != "page")
            {
                newUrl += "&" + name + "=" + value;
            }
        }

        newUrl += "&" + "page" + "=" + pageNumber;
        newUrl = "?" + newUrl.substring(1);

        navigate(`${urlo}${newUrl}`)
    }

    const renderPageButton = (pageNumber: number, isCurrent: boolean = false) => (
        <Button className={isCurrent ? 'pagination clicked' : 'pagination'} 
            type={isCurrent ? 'primary' : 'default'}
            onClick={() => changePage(pageNumber)}
        >{pageNumber}</Button>
    );

    const renderEllipsis = () => <Typography>...</Typography>;

    const renderPaginationButtons = () => {
        const buttons = [];
        
        if (all == 0 && !pageInfo)
        {
            buttons.push(renderPageButton(1, false));
        }
        else if (all == 0)
        {
            buttons.push(null);
        }
        else if (all <= 5) {
            for (let i = 1; i <= all; i++) {
                buttons.push(renderPageButton(i, i === current));
            }
        } else {
            if (current <= 3) {
                for (let i = 1; i <= 4; i++) {
                    buttons.push(renderPageButton(i, i === current));
                }
                buttons.push(renderEllipsis());
                buttons.push(renderPageButton(all));
            } else if (current >= all - 2) {
                buttons.push(renderPageButton(1));
                buttons.push(renderEllipsis());
                for (let i = all - 3; i <= all; i++) {
                    buttons.push(renderPageButton(i, i === current));
                }
            } else {
                buttons.push(renderPageButton(1));
                buttons.push(renderEllipsis());
                for (let i = current - 1; i <= current + 1; i++) {
                    buttons.push(renderPageButton(i, i === current));
                }
                buttons.push(renderEllipsis());
                buttons.push(renderPageButton(all));
            }
        }

        return buttons;
    };

    return (<Flex style={{...flexGapStyle}}>
        <Button 
            className="pagination" 
            disabled={current === 1} 
            onClick={() => changePage(current-1)}
        >
            <LeftOutlined />
        </Button>
        {renderPaginationButtons()}
        <Button 
            className="pagination" 
            disabled={current === all || all === 0} 
            onClick={() => changePage(current+1)}
        >
            <RightOutlined />
        </Button>
    </Flex>);
}

export default PageList;