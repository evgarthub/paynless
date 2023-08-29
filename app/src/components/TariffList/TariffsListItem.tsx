import {
    Button,
    Divider,
    Group,
    Stack,
    Switch,
    Text,
    Tooltip,
} from '@mantine/core';
import { format } from 'date-fns';
import { memo } from 'react';
import { ExternalLink } from 'tabler-icons-react';
import { Tariff } from '@client/models/Tariff';
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
                <Group position='apart'>
                    <Tooltip
                        label={
                            globalLabel.tariffsView.tariffItem.isEnabledTooltip
                        }
                        radius='md'
                    >
                        <Switch
                            checked={tariff.isEnabled}
                            readOnly={true}
                            size='md'
                            radius='lg'
                            color='green'
                            onLabel={globalLabel.tariffsView.tariffItem.enabled}
                            offLabel={
                                globalLabel.tariffsView.tariffItem.disabled
                            }
                            aria-label={
                                tariff.isEnabled
                                    ? globalLabel.tariffsView.tariffItem
                                          .enabledAria
                                    : globalLabel.tariffsView.tariffItem
                                          .disabledAria
                            }
                        />
                    </Tooltip>
                    <Group spacing='xs'>
                        <Text>{globalLabel.tariffsView.tariffItem.from}</Text>
                        <Text>{format(tariff.startDate, dateFormat)}</Text>
                    </Group>
                    <Stack>
                        {tariff.limits.map(({ cost, limit }) => (
                            <Text>
                                {cost} {globalLabel.currency}/{unit}{' '}
                                {limit ? `(<${limit} ${unit})` : null}
                            </Text>
                        ))}
                    </Stack>
                    <Button
                        component='a'
                        href={tariff.source}
                        target='_blank'
                        compact={true}
                        variant='subtle'
                        leftIcon={<ExternalLink size={14} />}
                    >
                        {globalLabel.tariffsView.tariffItem.viewSource}
                    </Button>
                </Group>
                <Divider my='sm' />
            </div>
        );
    }
);

TariffsListItem.displayName = 'TariffsListItem';
