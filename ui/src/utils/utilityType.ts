import {
    Bolt,
    Droplet,
    Icon,
    QuestionMark,
    SmartHome,
    Temperature,
} from 'tabler-icons-react';

export const getUtilityTypeIcon = (type: string): Icon => {
    switch (type) {
        case 'electricity':
            return Bolt;
        case 'heat':
            return Temperature;
        case 'service':
            return SmartHome;
        case 'water':
            return Droplet;
        default:
            return QuestionMark;
    }
};
