import React, { useRef } from "react";
import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";
export default function InputGroupMask({ label, type, classes, id, name, onChange, value, placeholder, disabled, readOnly, invalid, required, ref, mask, pattern }) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className="block w-full">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {required ? <span className="text-red-800">*</span> : <></>}
            </label>
            <div className="mt-1">
                <MaskedInput
                    type={type}
                    name={name}
                    id={id}
                    value={value}
                    onChange={onChange}
                    className={classNames(invalid ? 'border-red-800 focus:border-red-500 focus:ring-red-500 ' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ', classes, "block w-full rounded-md shadow-sm sm:text-sm disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500")}
                    placeholder=""
                    guide={false}
                    keepCharPositions={false}
                    showMask
                    mask={mask}
                    disabled={disabled}
                    readOnly={readOnly}
                    pattern={pattern}
                />
            </div>
            {invalid && <span className="text-sm font-medium tracking-tight text-red-800">This field is required</span>}
        </div>
    )
}
InputGroupMask.propTypes = {
    classes: PropTypes.string,
    ref: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    invalid: PropTypes.bool
};
InputGroupMask.defaultProps = {
    disabled: false,
    type: "text",
    placeholder: "",
    require: false,
    readOnly: false,
    value: "",
    invalid: false,
    mask: []
};