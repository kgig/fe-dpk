import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { renderOptions } from "../../helpers/utils";
import InputSelectGroup from "../InputSelectGroup";
import InputSelectGroupInline from "../InputSelectGroupInline";
import { useEffect, useState } from "react";
import InputGroupInline from "../InputGroupInline";
import InputGroupMaskInline from "../InputGroupMaskInline";

export default function ItemInventory({ extraInventory, deleteAddOnService, callbackInventory }) {
  const [inventoryList, setInventoryList] = useState([]);
  useEffect(() => {
    setInventoryList(extraInventory);
  }, [extraInventory]);

  const insertInventory = async () => {
    let lastElement =
      inventoryList.length > 0
        ? inventoryList[inventoryList.length - 1]
        : { index: 0 };
    let newService = {
      index: lastElement.index + 1, //timeSheetForm.length + 1,
      startDate: "",
      employee: {},
      mainBranch: {},
      subBranch: {},
      task: {},
    };
    const _newValue = [...inventoryList, newService]
    setInventoryList((item) => [...item, newService]);
    callbackInventory(_newValue)
  };
  const deleteInventory = async (rowIndex) => {
    console.log("rowIndex", rowIndex);
    const newData = inventoryList.filter((item) => item.index !== rowIndex);
    console.log("newData", newData);
    setInventoryList(newData);
  };
  const onChange = (e, index, name) => {
    console.log("onChange", e.target.value, index, name);
    let _newValue = [...inventoryList];
    _newValue[index][name] = e.target.value;
    setInventoryList(_newValue);
  };
  return (
    <div className="flow-root">
      {inventoryList &&
        inventoryList.map((extra, index) => {
          return (
            <>
              <div className="flex space-x-4 items-center" key={index}>
                <div className="flex-auto w-64">
                  <InputSelectGroupInline
                    type="text"
                    id="inventory"
                    name="inventory"
                    label="สินค้าคงคลัง:"
                    // options={renderOptions(extraCharge, "configValue", "configCode")}
                    // options={renderOptions(enp, "configValue", "configCode")}
                    value={extra.inventory}
                    onChange={(e) => {
                      onChange(e, index, "inventory");
                    }}
                  />
                </div>
                <div className="flex-auto w-64">
                  <InputGroupMaskInline
                    type="text"
                    id="pickupAmount"
                    name="pickupAmount"
                    label="จำนวน:"
                    classes=""
                    value={extra.pickupAmount}
                    mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                    onChange={(e) => {
                      onChange(e, index, "pickupAmount");
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => deleteInventory(extra.index)}
                  className="bg-white hover:bg-gray-100 border border-gray-200 font-medium text-gray-500 rounded-lg text-sm px-1 py-1 text-center inline-flex items-center mt-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </>
          );
        })}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-2 mt-2">
        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-indigo-800 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-80"
            onClick={insertInventory}
          >
            <PlusCircleIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            เพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
}