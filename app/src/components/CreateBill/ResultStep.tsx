import { BillCard } from '@components/BillCard';
import { Record as RecordModel, Type } from '@client/models';
import { memo, useMemo } from 'react';
import { BillUtil } from '@client/models/Bills';
import { useTariffsQuery } from '@client/queries/useTariffsQuery';
import { Tariff } from '@client/models/Tariff';
import { isBefore } from 'date-fns';

const getCost = (value: number, tariff: Tariff) => {
    if (tariff.isAbsolute) {
        return value * tariff.limits[0].cost;
    }

    // [100, 200, 300, null]
    tariff.limits.sort((a, b) => {
        if (!a.limit) {
            return 1;
        }

        if (!b.limit) {
            return -1;
        }

        return a.limit > b.limit ? 1 : -1;
    });

    let remainingValue = value;
    let totalCost = 0;
    const remainingLimits = tariff.limits;

    while (remainingValue !== 0) {
        const currentLimit = remainingLimits.shift()!;

        if (!currentLimit.limit || remainingValue < currentLimit.limit) {
            totalCost += remainingValue * currentLimit.cost;
            remainingValue = 0;
            continue;
        }

        if (value >= currentLimit.limit) {
            remainingValue -= currentLimit.limit;
            totalCost += currentLimit.limit * currentLimit.cost;
        }
    }

    return totalCost;
};

const calculateTotal = (utils: ReadonlyArray<BillUtil>): number => {
    let result = 0;

    utils.forEach((u) => (result += u.cost));

    return result;
};

export interface ResultStepProps {
    period: Date;
    types: Type[];
    records: Record<number, RecordModel[]>;
}

export const ResultStep = memo(
    ({ period, records, types }: ResultStepProps) => {
        const { data: tariffs } = useTariffsQuery();

        const utils = useMemo<BillUtil[]>(() => {
            return types.map((type) => {
                const lastRecords = records[type.id];
                const recordFrom =
                    lastRecords[0] > lastRecords[1]
                        ? lastRecords[1]
                        : lastRecords[0];
                const recordTo =
                    lastRecords[1] > lastRecords[0]
                        ? lastRecords[1]
                        : lastRecords[0];
                const typeTariffs = tariffs?.filter((tariff) => {
                    if (!tariff.isEnabled) return false;

                    return tariff.type?.id === type.id;
                });

                const latestTariff = typeTariffs?.sort((a, b) =>
                    isBefore(a.startDate, b.startDate) ? 1 : -1
                )[0];
                const value = recordTo.value - recordFrom.value;
                const cost = latestTariff?.isAbsolute
                    ? getCost(recordTo.value, latestTariff)
                    : latestTariff
                    ? getCost(value, latestTariff)
                    : 0;

                if (!latestTariff) {
                    throw Error(
                        `Перевірте чи є хоча б один активний тариф для ${type.name}`
                    );
                }

                return {
                    name: type.name,
                    tariff: latestTariff,
                    value,
                    cost,
                    type,
                    recordFrom,
                    recordTo,
                };
            });
        }, [records, tariffs, types]);

        return (
            <BillCard
                payDate={period}
                total={calculateTotal(utils)}
                utils={utils}
            />
        );
    }
);

ResultStep.displayName = 'ResultStep';
