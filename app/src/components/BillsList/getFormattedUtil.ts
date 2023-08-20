import { BillUtil } from '../../client/models/Bills';
import { globalLabel } from '../../global/labels';
import { SimpleRowData } from '../Table/TableRow';

interface FormattedUtil extends SimpleRowData {
    name: string;
    range: string;
    value: string;
    tariff: string;
    cost: string;
}

export const getFormattedUtil = (util: BillUtil): FormattedUtil => {
    const fromValue = util.recordFrom.data.attributes.value;
    const toValue = util.recordTo.data.attributes.value;
    const unit = util.type.data.attributes.unit;
    const name = util.type.data.attributes.label;
    const range = `${fromValue} → ${toValue} ${unit}`;
    const value = `${toValue - fromValue} ${unit}`;
    const tariff = `${util.tariff.data.attributes.cost} ${globalLabel.currency}/${unit}`;
    const cost = `${util.cost} ${globalLabel.currency}`;

    return {
        name,
        range,
        value,
        tariff,
        cost,
    };
};
