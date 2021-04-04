import { Moment } from "moment";

export const momentDateFormat = (date: Moment) => {
    return date.format('YYYY-MM-DD');
};