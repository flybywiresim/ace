import React, { FC, FormEvent, useEffect, useState } from 'react';

export interface FilterDefinition {
    /**
     * Name of the filter
     */
    key: string,

    /**
     * Description of the filter
     */
    description?: string,

    /**
     * Possible values for the filter. If empty, any value is allowed.
     */
    possibleValues: string[],
}

export interface SearchFilterBarProps {
    filters: FilterDefinition[],
}

export const SearchFilterBar: FC<SearchFilterBarProps> = ({ filters }) => {
    const [userInput, setUserInput] = useState('');
    const [autocompleteElements, setAutocompleteElements] = useState<AutocompleteElement[]>([]);

    const handleUserInput = (e: FormEvent<HTMLInputElement>) => setUserInput(e.currentTarget.value);

    useEffect(() => {
        if (userInput.length > 0) {
            const exactFilterMatch = filters.find((it) => it.key === userInput);

            if (exactFilterMatch) {
                setAutocompleteElements(exactFilterMatch.possibleValues.map((it) => ({
                    value: (
                        <>
                            <span>{exactFilterMatch.key}</span>
                            <span>:</span>
                            <span className="text-teal-light">{it}</span>
                        </>
                    ),
                    description: `Events from instrument '${it}'`,
                })));
            } else {
                const autocompleteFilters = filters.filter((it) => it.key.startsWith(userInput));

                setAutocompleteElements(autocompleteFilters.map((it) => ({
                    value: it.key,
                    description: it.description,
                })));
            }
        }
    }, [userInput]);

    return (
        <>
            <input onInput={handleUserInput} />

            {autocompleteElements.length > 0 && (
                <div className="relative w-full h-0">
                    <div className="w-full flex flex-col gap-y-2 mt-2 py-1.5 bg-gray-800 rounded-md shadow-lg">
                        {autocompleteElements.map((it) => (
                            <AutocompleteElementRender element={it} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

interface AutocompleteElement {
    value: React.ReactNode,
    description: string,
}

interface AutocompleteElementRenderProps {
    element: AutocompleteElement,
}

const AutocompleteElementRender: FC<AutocompleteElementRenderProps> = ({ element: { value, description } }) => (
    <span className="flex flex-row px-3">
        <span className="w-[160px] text-md font-mono">{value}</span>
        <span className="text-md font-mono text-gray-300">{description}</span>
    </span>
);
