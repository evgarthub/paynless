import {
    Box,
    ColorScheme,
    ColorSchemeProvider,
    Divider,
    MantineProvider,
    Navbar,
} from '@mantine/core';
import { memo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
    ColorSwatch,
    CurrencyCent,
    DeviceHeartMonitor,
    CurrencyDollar,
} from 'tabler-icons-react';
import {
    MainView,
    RecordsView,
    TypesView,
    TariffsView,
    BillsView,
} from './views';
import { ViewLink, Header } from './components';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './client/queryClient';
import { globalLabel } from './global/labels';
import { LoginPage } from './components/LoginPage';
import { GoogleAuthCallback } from './views/GoogleAuthCallback';
import { NotificationsProvider } from '@mantine/notifications';

export const App = memo(() => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ColorSchemeProvider
                    colorScheme={colorScheme}
                    toggleColorScheme={toggleColorScheme}
                >
                    <MantineProvider
                        theme={{ colorScheme, loader: 'bars' }}
                        withGlobalStyles
                        withNormalizeCSS
                    >
                        <NotificationsProvider>
                            <Box
                                sx={() => ({
                                    display: 'flex',
                                })}
                            >
                                <Navbar p='xs' width={{ base: 300 }}>
                                    <Navbar.Section>
                                        <Header />
                                    </Navbar.Section>
                                    <Divider my='sm' />
                                    <Navbar.Section grow={true} mt='md'>
                                        <ViewLink
                                            label={
                                                globalLabel.recordsView.title
                                            }
                                            color='cyan'
                                            icon={DeviceHeartMonitor}
                                            path='/records'
                                        />
                                        <ViewLink
                                            label={globalLabel.typesView.title}
                                            color='green'
                                            icon={ColorSwatch}
                                            path='/types'
                                        />
                                        <ViewLink
                                            label={
                                                globalLabel.tariffsView.title
                                            }
                                            color='pink'
                                            icon={CurrencyCent}
                                            path='/tariffs'
                                        />
                                        <ViewLink
                                            label={globalLabel.billsView.title}
                                            color='yellow'
                                            icon={CurrencyDollar}
                                            path='/bills'
                                        />
                                    </Navbar.Section>
                                    <Divider my='sm' />
                                    <Navbar.Section mt='md'>
                                        <LoginPage />
                                    </Navbar.Section>
                                </Navbar>

                                <Box
                                    sx={() => ({
                                        display: 'flex',
                                        flexGrow: 1,
                                        maxHeight: '100vh',
                                    })}
                                >
                                    <Routes>
                                        <Route
                                            path='/'
                                            element={<MainView />}
                                        />
                                        <Route
                                            path='/auth/google/callback'
                                            element={<GoogleAuthCallback />}
                                        />
                                        <Route
                                            path='/records'
                                            element={<RecordsView />}
                                        />
                                        <Route
                                            path='/types'
                                            element={<TypesView />}
                                        />
                                        <Route
                                            path='/tariffs'
                                            element={<TariffsView />}
                                        />
                                        <Route
                                            path='/bills'
                                            element={<BillsView />}
                                        />
                                    </Routes>
                                </Box>
                            </Box>
                        </NotificationsProvider>
                    </MantineProvider>
                </ColorSchemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
});

App.displayName = 'App';
