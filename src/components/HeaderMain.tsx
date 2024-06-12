import React from 'react';
import { Layout, Flex, Typography } from 'antd';
import { 
    headerStyle, 
    headerMainFlexStyle, 
    headerUserFlexStyle, 
    headerEntry, scullIconStyle, 
    headerScullAndTitle, 
    headerScull, 
    headerTitles, 
    headerParagraph,
    headerTitle,
    headerWrapperForTitle
} from '../styles/additionalStyles';
import {ScullIcon} from "../icons/Scull";

const {Header} = Layout;
const {Paragraph, Title} = Typography;

function HeaderMain()
{
    return (
        <Header style={headerStyle}>
            <Flex style={headerMainFlexStyle}>
                <Flex style={headerScullAndTitle}>
                    <Flex style={headerScull}>
                        <ScullIcon style={scullIconStyle}/>
                    </Flex>
                    <Flex style={headerTitles}>
                        <Flex>
                            <Paragraph style={headerParagraph}>Try not to</Paragraph>
                        </Flex>
                        <Flex style={headerWrapperForTitle}>
                            <Title style={headerTitle}>DIE</Title>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex style={headerUserFlexStyle}>
                    <Paragraph style={headerEntry}>Вход</Paragraph>
                </Flex>
            </Flex>
        </Header>
    )
}

export default HeaderMain;