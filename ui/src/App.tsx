import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { apolloClient } from './storage';
import { HomePage, RecordsPage, BillsPage } from './views';
import './App.css';
import { Layout } from 'antd';
import { Center } from './layout';
import styled from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { SidebarNav } from './components';
import { nav } from './constants/navigation';
import { setupMoment } from './config/moment';

setupMoment();

const ContentContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  padding: 25px; 
  min-height: 360px;
  height: 100vh;
`;

export const App = () => {
  const { Content, Footer } = Layout;  

  return (
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <Layout style={{ height: '100vh' }}>
          <SidebarNav />
          <Layout>
              <Content>
                <ContentContainer>
                  <Switch>
                    <Route path={nav.bills} component={BillsPage} />
                    <Route path={nav.records} component={RecordsPage} />
                    <Route path={nav.homepage} component={HomePage} />
                  </Switch>
                </ContentContainer>
              </Content>
            <Footer>
              <Center>©2020 Created by EvgART</Center>
            </Footer>
          </Layout>
          
        </Layout>
      </ApolloProvider>
    </BrowserRouter>
  );
};
