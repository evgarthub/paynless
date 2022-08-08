import { Button, Divider, Group, Switch, Text, Tooltip } from '@mantine/core';
import { format } from 'date-fns';
import { memo } from 'react';
import { ExternalLink } from 'tabler-icons-react';
import { Tariff } from '../../client/models/Tariff';
import { dateFormat } from '../../global/date';
import { globalLabel } from '../../global/labels';

export interface TariffsListItemProps {
    tariff: Tariff;
    unit: string;
}

export const TariffsListItem = memo(
    ({ tariff, unit }: TariffsListItemProps) => {
        return (
            <div>
                <Divider my='sm' />
                <Group position='apart'>
                    <Tooltip
                        label={
                            globalLabel.tariffsView.tariffItem.isEnabledTooltip
                        }
                        radius='md'
                    >
                        <Switch
                            checked={tariff.attributes.isEnabled}
                            readOnly={true}
                            size='md'
                            radius='lg'
                            color='green'
                            onLabel={globalLabel.tariffsView.tariffItem.enabled}
                            offLabel={
                                globalLabel.tariffsView.tariffItem.disabled
                            }
                            aria-label={
                                tariff.attributes.isEnabled
                                    ? globalLabel.tariffsView.tariffItem
                                          .enabledAria
                                    : globalLabel.tariffsView.tariffItem
                                          .disabledAria
                            }
                        />
                    </Tooltip>
                    <Group spacing='xs'>
                        <Text>{globalLabel.tariffsView.tariffItem.from}</Text>
                        <Text>
                            {format(tariff.attributes.startDate, dateFormat)}
                        </Text>
                    </Group>
                    <Text>
                        {tariff.attributes.cost} {globalLabel.currency}/{unit}{' '}
                        {tariff.attributes.limit
                            ? `(<${tariff.attributes.limit} ${unit})`
                            : null}
                    </Text>
                    <Button
                        component='a'
                        href={tariff.attributes.source}
                        target='_blank'
                        compact={true}
                        variant='subtle'
                        leftIcon={<ExternalLink size={14} />}
                    >
                        {globalLabel.tariffsView.tariffItem.viewSource}
                    </Button>
                </Group>
            </div>
        );
    }
);

TariffsListItem.displayName = 'TariffsListItem';
