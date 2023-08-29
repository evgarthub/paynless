import { globalLabel } from '../../global/labels';
import { SimpleRowData } from '../Table/TableRow';
import { Tariff } from '@client/models/Tariff';
import { Record } from '@client/models/Record';
import { Type } from '@client/models/Type';

interface FormattedUtil extends SimpleRowData {
    nameString: string;
    rangeString: string;
    valueString: string;
    tariffString: string;
    costString: string;
}

export interface GetFormattedUtilProps {
    recordFrom: Omit<Record, 'type'>;
    recordTo: Omit<Record, 'type'>;
    type: Type;
    tariff: Tariff;
    cost: number;
}

export const getFormattedUtil = ({
    recordFrom,
    recordTo,
    tariff,
    type,
    cost,
}: GetFormattedUtilProps): FormattedUtil => {
    const fromValue = recordFrom.value;
    const toValue = recordTo.value;
    const unit = type.unit;
    const nameString = type.label;

    const rangeString = `${fromValue} → ${toValue} ${unit}`;
    const valueString = `${toValue - fromValue} ${unit}`;
    const tariffString = `${tariff.limits.map(
        (l) =>
            `${l.cost} ${globalLabel.currency}/${unit} ${
                l.limit ? `(${l.limit} ${unit})` : ''
            }\n`
    )}`;
    const costString = `${cost} ${globalLabel.currency}`;

    return {
        nameString,
        rangeString,
        valueString,
        tariffString,
        costString,
    };
};
