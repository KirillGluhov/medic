import React, { useState } from 'react';
import { Layout, Flex, Typography, Dropdown, Col, Row } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type {MenuProps } from 'antd';
import axios from 'axios';
import { 
    headerStyle, 
    headerMainFlexStyle, 
    headerUserFlexStyle, 
    headerEntry, 
    headerEntryHover,
    scullIconStyle, 
    headerScullAndTitle, 
    headerScull, 
    headerTitles, 
    headerParagraph,
    headerTitle,
    headerWrapperForTitle,
    headerDropdownStyle,
    downIconStyle,
    headerDropdownWrap,
    headerLoginStyle,
    headerParagraphMenuStyle,
    headerColStyle,
    headerColStyleForMenu,
    headerRowStyle,
    height100,
    flexCenter,
    colHeaderRowStyle
} from '../styles/additionalStyles';
import {ScullIcon} from "../icons/Scull";
import { useLogin } from '../context/LoginContext';
import { baseUrl } from '../const/constValues';
import { useName } from '../context/NameContext';

const {Header} = Layout;
const {Paragraph, Title} = Typography;

function HeaderMain()
{
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);

    const {isName, setIsName} = useName();
    const {isLogin, setIsLogin} = useLogin();
    //const isLogin = useSelector((state: RootState) => state.isLogin.isLogin);
    //const dispatch = useDispatch();

    const handleProfile = () => {
        if (isLogin)
        {
            navigate("/profile/");
        }
    }

    const handleLogout = () => {
        axios.post(
            baseUrl + "doctor/logout", 
            null,
            { 
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
      .then(function (response) 
      {
        console.log(response);
        localStorage.clear();
        setIsLogin(false);
        //dispatch(setIsLogin(false));
        setIsName('');
        navigate('/login/')

      })
      .catch(function (error) 
      {
        console.log(error);
        localStorage.removeItem("token");
        setIsLogin(false);
        //dispatch(setIsLogin(false));
        setIsName('');
        navigate('/login/')
      })
    };

    const items: MenuProps['items'] = [
        {
          label: "Профиль",
          key: '0',
          onClick: handleProfile
        },
        {
          label: "Выход",
          key: '1',
          onClick: handleLogout
        }
    ];

    const handleClick = () => {
        navigate('/login/')
    }

    return (
        <Header style={headerStyle} className='headerTop'>
            <Row style={headerRowStyle}>
                <Col className='colTop' lg={16} md={24} xs={24} style={{...headerColStyleForMenu, ...colHeaderRowStyle}}>
                    <Row style={height100}>
                        <Col xxl={8} xl={8} md={8} sm={10} xs={10} style={height100}>
                            <Row style={height100}>
                                <Col xxl={8} xl={8} md={7} xs={7} style={height100}>
                                    <ScullIcon style={scullIconStyle}/>
                                </Col>
                                <Col xxl={8} xl={12} md={14} xs={14} style={height100}>
                                    <Row>
                                        <Col span={24}>
                                            <Paragraph style={headerParagraph}>Try not to</Paragraph>
                                        </Col>
                                        <Col span={24}>
                                            <Title style={headerTitle}>DIE</Title>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col xxl={12} xl={16} md={16} sm={8} xs={10} style={{...headerColStyleForMenu, ...height100, ...flexCenter}}>
                            { isLogin ?
                            <Row style={headerRowStyle}>
                                <Col lg={7} md={6} sm={24} xs={24}>
                                    <Paragraph style={headerParagraphMenuStyle} onClick={() => {navigate("/patients/")}}>Пациенты</Paragraph>
                                </Col>
                                <Col lg={7} md={7} sm={24} xs={24}>
                                    <Paragraph style={headerParagraphMenuStyle} onClick={() => {navigate("/consultations/")}}>Консультации</Paragraph>
                                </Col>
                                <Col lg={10} md={11} sm={24} xs={24}>
                                    <Paragraph style={headerParagraphMenuStyle} onClick={() => {navigate("/reports/")}}>Отчёты и статистика</Paragraph>
                                </Col>
                            </Row> : null
                            }
                        </Col>
                    </Row>
                </Col>
                <Col className='colTop name' lg={8} md={24} xs={24} style={{...headerColStyle, ...colHeaderRowStyle}}>
                    {isLogin ? 
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <a 
                            onClick={(e) => e.preventDefault()} 
                            style={
                                {...headerDropdownStyle}
                            }
                        >
                            <span style={{...headerDropdownWrap}}>{isName}</span>
                            <DownOutlined style={downIconStyle}/>
                        </a>
                    </Dropdown> : 
                    <Paragraph 
                        style={hover ? headerEntryHover : headerEntry}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={handleClick}
                    >Вход</Paragraph>}
                </Col>
            </Row>
        </Header>
    )
}

export default HeaderMain;
/*
                <Flex style={headerScullAndTitle}>
                    <Flex style={headerScull}>
                        <ScullIcon style={scullIconStyle}/>
                    </Flex>
                    <Flex >
                        <Flex style={headerTitles}>
                            <Flex>
                                <Paragraph style={headerParagraph}>Try not to</Paragraph>
                            </Flex>
                            <Flex style={headerWrapperForTitle}>
                                <Title style={headerTitle}>DIE</Title>
                            </Flex>
                        </Flex>
                        <Flex style={headerLoginStyle}>
                            {isLogin ? <>
                            <Paragraph style={headerParagraphMenuStyle} onClick={() => {navigate("/patients/")}}>Пациенты</Paragraph>
                            <Paragraph style={headerParagraphMenuStyle}>Консультации</Paragraph>
                            <Paragraph style={headerParagraphMenuStyle}>Отчёты и статистика</Paragraph>
                            </>
                            : null
                            }
                        </Flex>
                    </Flex>
                </Flex>

*/