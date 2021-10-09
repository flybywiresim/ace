export interface IdentifiableElement {
    /**
     * UUID of this element
     */
    __uuid: string,
}

export type IdentifiableElementData<T extends IdentifiableElement> = Omit<T, '__uuid'>
