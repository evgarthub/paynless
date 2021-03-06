import moment from "moment";

export const setupMoment = () => {
    moment.updateLocale('en', {
        months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
        "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл",
        "Авг", "Сен", "Окт", "Ноя", "Дек"]
    });    
}