import { IdentifiableElement } from '../IdentifiableElement';

export interface CanvasElement<TKind extends string> extends IdentifiableElement {
    /**
     * Type marker for canvas element
     */
    __kind: TKind,

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
