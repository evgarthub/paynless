import {
  ActionIcon,
  Button,
  MantineColor,
  Popover,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { memo, useCallback } from "react";
import { Icon, X } from "tabler-icons-react";
import { globalLabel } from "../global/labels";
import { FloatingPosition } from "@mantine/core/lib/Floating";

export interface ActionIconConfirmProps {
  icon: Icon;
  confirmMessage: string;
  tooltip: string;
  onClick: () => void;
  position?: FloatingPosition;
  color?: MantineColor;
}

export const ActionIconConfirm = memo(
  ({
    icon: IconComponent,
    position,
    confirmMessage,
    color,
    tooltip,
    onClick,
  }: ActionIconConfirmProps) => {
    const [isOpened, toggleIsOpened] = useToggle();

    const handleIconClick = useCallback(() => {
      toggleIsOpened();
    }, [toggleIsOpened]);

    const handleConfirm = useCallback(() => {
      onClick();
      toggleIsOpened();
    }, [onClick, toggleIsOpened]);

    return (
      <Popover
        opened={isOpened}
        position={position}
        arrowPosition="center"
        withArrow={true}
        radius="lg"
        // onClose={toggleIsOpened}
      >
        <Popover.Target>
          <ActionIcon
            onClick={handleIconClick}
            title={
              !isOpened ? tooltip : globalLabel.actionIconConfirm.cancelButton
            }
          >
            {!isOpened ? <IconComponent /> : <X />}
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack spacing="sm">
            <Text>{confirmMessage}</Text>
            <Button size="sm" radius="lg" onClick={handleConfirm} color={color}>
              {globalLabel.actionIconConfirm.confirmButton}
            </Button>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    );
  }
);

ActionIconConfirm.displayName = "ActionIconConfirm";
