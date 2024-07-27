import "./index.css";
import React from "react";
import {ICellRendererParams} from "ag-grid-community";

interface CountryFlagRendererProps extends ICellRendererParams {
    value: string;
}

const CountryFlagRenderer: React.FC<CountryFlagRendererProps> = ({value}) => {
    return (
        <img
            alt={`${value} Flag`}
            src={value}
            className="country-flag"
        />
    )
};

export default CountryFlagRenderer;