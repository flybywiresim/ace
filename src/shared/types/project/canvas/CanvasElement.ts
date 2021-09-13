export interface CanvasElement<TKind extends string> {
    /**
     * Type marker for canvas element
     */
    __kind: TKind,

    /**
     * UUID of this element
     */
    __uuid: string,

    /**
     * Position of element on canvas
     */
    position: {
        x: number,
        y: number,
    }

    /**
     * Title of element
     */
    title: string,
}
