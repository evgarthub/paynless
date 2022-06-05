import { getUtilityTypeIcon } from '../utils/utilityType';
import { memo } from 'react';
import { IconProps } from 'tabler-icons-react';
import { Type } from '../client/models/Type';

export interface TypeIconProps extends Omit<IconProps, 'type'> {
    type: Type;
}

export const TypeIcon = memo(({ type, ...iconProps }: TypeIconProps) => {
    const Icon = getUtilityTypeIcon(type.attributes.name);

    return <Icon {...iconProps} />;
});

TypeIcon.displayName = 'TypeIcon';
