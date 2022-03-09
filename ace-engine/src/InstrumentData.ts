/**
 * Data necessary to load an instrument
 */
export interface InstrumentData {
    /**
     * Display name for the instrument
     */
    displayName: string,

    /**
     * Root instrument tag name
     */
    elementName: string,

    /**
     * JS source to inject into the instrument
     */
    jsSource: string,

    /**
     * CSS source to inject into the instrument
     */
    cssSource: string,
}
