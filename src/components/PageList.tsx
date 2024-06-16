import { Button, Flex, Row } from "antd";
import { flexGapStyle } from "../styles/additionalStyles";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function PageList()
{
    return (<Flex style={flexGapStyle}>
    <Button className="pagination"><LeftOutlined/></Button>
    <Button className="pagination">1</Button>
    <Button className="pagination">2</Button>
    <Button className="pagination">3</Button>
    <Button className="pagination">4</Button>
    <Button className="pagination">5</Button>
    <Button className="pagination"><RightOutlined/></Button>
    </Flex>);
}

export default PageList;