import React, {ChangeEvent, useState} from "react";

function useInput(initialValue: string, extended: boolean = false): [string, (e: ChangeEvent<HTMLInputElement>) => void, React.Dispatch<React.SetStateAction<string>>?] {
    const [value, setValue] = useState(initialValue)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    if (extended)
        return [
            value,
            handleChange,
            setValue
        ]
    else
        return [
            value,
            handleChange,
        ];
}

export default useInput