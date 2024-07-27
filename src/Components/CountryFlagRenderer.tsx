import { CustomCellRendererProps } from '@ag-grid-community/react';

const CountryFlagRenderer = (params: CustomCellRendererProps) => (
    <span className="imgSpanLogo">
        {params.value && (
            <img
                alt={`${params.value} Flag`}
                src={params.value}
                className="country-flag"
            />
        )}
    </span>
);

export default CountryFlagRenderer;