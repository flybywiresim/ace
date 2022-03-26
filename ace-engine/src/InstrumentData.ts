/**
 * Data necessary to load an instrument
 */
export interface BaseInstrumentData {
    __kind: string,

    /**
     * Unique name for the instrument instance
     */
    uniqueID: string,

    /**
     * Display name for the instrument
     */
    displayName: string,

    /**
     * Root instrument tag name
     */
    elementName: string,

    /**
     * Size of the instrument
     */
    dimensions: {
        width: number,

        height: number,
    },
}

export interface InstrumentFile {
    fileName: string,
    path: string,
    contents: string,
}

/**
 * Data necessary to load a bundled instrument
 */
export interface BundledInstrumentData extends BaseInstrumentData {
    __kind: 'bundled',

    /**
     * JS source to inject into the instrument
     */
    jsSource: InstrumentFile,

    /**
     * CSS source to inject into the instrument
     */
    cssSource: InstrumentFile,
}

export interface WebInstrumentData extends BaseInstrumentData {
    __kind: 'web',

    /**
     * The URL of the webpage to display as the instrument
     */
    url: string,
}

export type InstrumentData = BundledInstrumentData | WebInstrumentData
