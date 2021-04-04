import { useState, useMemo } from 'react';

export const useSelection = <T>(items: T[], defaultSelected: T[] = []) => {
    const [selected, setSelected] = useState<T[]>(defaultSelected);

    const selectedSet = useMemo(() => new Set<T>(selected), [selected]);

    const singleActions = useMemo(() => {
        const isSelected = (item: T) => selectedSet.has(item);

        const select = (item: T) => selectedSet.add(item);

        const deselect = (item: T) => selectedSet.delete(item);

        const toggle = (item: T) => {
            if (isSelected(item)) {
                deselect(item);
            } else {
                select(item);
            }
        };

        return { isSelected, select, deselect, toggle };
    }, [selectedSet]);

    const allActions = useMemo(() => {
        const selectAll = () => setSelected(Array.from(selectedSet));

        const deselectAll = () => setSelected(Array.from(selectedSet));

        const noneSelected = items.every((o) => !selectedSet.has(o));

        const allSelected = items.every((o) => selectedSet.has(o)) && !noneSelected;

        const partiallySelected = !noneSelected && !allSelected;

        const toggleAll = () => (allSelected ? deselectAll() : selectAll());

        return { selectAll, deselectAll, noneSelected, allSelected, partiallySelected, toggleAll };
    }, [selectedSet, items]);

    return {
        selected,
        setSelected,
        ...singleActions,
        ...allActions,
    } as const;
};
