import "./index.css"
import React, {useCallback} from "react";
import {AgGridReact} from "ag-grid-react";

interface CountriesSearchInputProps {
    gridRef:  React.RefObject<AgGridReact>
}

const CountriesSearchInput: React.FC<CountriesSearchInputProps> = ({gridRef}) => {
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current!.api.setGridOption(
            "quickFilterText",
            (document.getElementById("filter-text-box") as HTMLInputElement).value,
        );
    }, [gridRef]);

    return (
        <div>
            <input
                type="text"
                id="filter-text-box"
                placeholder="Search..."
                onInput={onFilterTextBoxChanged}
            />
        </div>
    )
}

export default CountriesSearchInput;