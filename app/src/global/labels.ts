export const globalLabel = {
    currency: 'грн',
    unit: 'Одиниця',
    recordsView: {
        title: 'Усі показання',
        description: 'Сторінка, на якій можна відстежувати всі свої показання',
        allFilter: 'Усі',
        list: {
            type: 'Послуга',
            value: 'Показання',
            date: 'Дата',
            actions: 'Дії',
            deleteConfirmMessage: 'Ви впевнені?',
            deleteTooltip: 'Видалити запис',
        },
        create: 'Створити',
    },
    typesView: {
        title: 'Види послуг',
        description:
            'Керуйте всіма комунальними послугами, доступними у вашому домі',
        typeItem: {
            name: 'Ідентифікатор',
            color: 'Колір',
        },
        create: 'Створити',
        list: {
            deleteConfirmMessage: 'Ви впевнені?',
            deleteTooltip: 'Видалити запис',
        },
    },
    billsView: {
        title: 'Рахунки',
        description: 'Сплачені рахунки за спожиті послуги',
        table: {
            nameString: 'Послуга',
            rangeString: 'Показання',
            valueString: 'Витрачено',
            tariffString: 'Тариф',
            costString: 'Вартість',
        },
    },
    tariffsView: {
        title: 'Тарифи',
        description: 'Оновлення тарифів на комунальні послуги',
        tariffItem: {
            from: 'від',
            viewSource: 'Джерело',
            isEnabledTooltip: 'Де-/Активувати тариф',
            enabled: 'Діє',
            disabled: 'Арх',
            enabledAria: 'Чинний тариф',
            disabledAria: 'Архівований тариф',
        },
    },
    createBill: {
        title: 'Створити платіжку',
        createButton: 'Створити',
        apiErrorTitle: 'Ми не змогли створити рахунок',
        steps: {
            period: {
                title: 'Місяць',
                fields: {
                    periodLabel: 'Період для оплати',
                    periodPlaceholder: 'Оберiть дату',
                },
            },
            types: {
                title: 'Послуги',
            },
            records: {
                title: 'Показання',
            },
            confirmation: {
                title: 'Зберегти',
            },
        },
    },
    createRecord: {
        title: 'Додати показання',
        value: 'Значення',
        valuePlaceholder: 'Введiть значення',
        type: 'Вид послуги',
        typePlaceholder: 'Оберiть одну з послуг',
        date: 'Дата показання',
        datePlaceholder: 'Оберiть дату',
        create: 'Додати',
        cancel: 'Скасувати',
        apiErrorTitle: 'Ми не змогли створити запис',
    },
    createType: {
        title: 'Додати послугу',
        color: 'Колір',
        colorPlaceholder: 'Оберіть один з кольорів',
        label: 'Назва українською',
        labelPlaceholder: 'Придумайте назву',
        name: `Ім'я`,
        namePlaceholder: `Унікальне ім'я латиницею`,
        unit: 'Одиниця виміру',
        unitPlaceholder: 'Введіть буквенне позначення виміру',
        create: 'Додати',
        cancel: 'Скасувати',
        colorEmpty: 'Нічого не знайдено',
        apiErrorTitle: 'Ми не змогли створити запис',
    },
    actionIconConfirm: {
        confirmButton: 'Так',
        cancelButton: 'Скасувати',
    },
};
