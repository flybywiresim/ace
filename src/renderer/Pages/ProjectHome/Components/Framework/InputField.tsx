import React, { FC } from 'react';

export interface InputFieldProps extends React.HTMLProps<HTMLInputElement> {

}

export const InputField: FC<InputFieldProps> = ({ ...rest }) => (
    <input
        {...rest}
        // We stop propagation of those events so that the canvas doesn't pick them up
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
    />
);
