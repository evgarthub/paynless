import { memo } from 'react';

export const MainView = memo(() => {
    return <span>Hello world</span>;
});

MainView.displayName = 'MainView';
