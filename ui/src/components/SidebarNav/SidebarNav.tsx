import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { nav } from '../../constants/navigation';
import {
    DatabaseOutlined,
    PieChartOutlined,
    HomeOutlined,
    UserOutlined,
    DollarCircleOutlined,
  } from '@ant-design/icons';

export const SidebarNav = () => {
    const { Sider } = Layout;
    const { SubMenu, Item } = Menu;
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const { pathname } = useLocation();

    const handleCollapse = () => setCollapsed(!collapsed);

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={handleCollapse}>
            <Menu theme="dark" defaultSelectedKeys={['1']} selectedKeys={[pathname]} mode="inline">
              <Item key={nav.homepage} icon={<HomeOutlined />}>
                <Link to={nav.homepage}>Обзор</Link>
              </Item>
              <Item key={nav.bills} icon={<DollarCircleOutlined />}>
                <Link to={nav.bills}>Платежи</Link>
              </Item>
              <Item key={nav.records} icon={<DatabaseOutlined />}>
                <Link to={nav.records}>Записи</Link>
              </Item>
              <Item key={nav.stats} icon={<PieChartOutlined />}>
                <Link to={nav.stats}>Статистика</Link>
              </Item>
              <SubMenu key="sub1" icon={<UserOutlined />} title="Учетная запись">
                <Item key="3">Tom</Item>
                <Item key="4">Bill</Item>
                <Item key="5">Alex</Item>
              </SubMenu>
            </Menu>
          </Sider>
    )
}