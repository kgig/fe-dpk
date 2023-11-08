import InputGroupDate from "../InputGroupDate";
import InputSelectGroup from "../InputSelectGroup";
import { _resObjConfig, renderOptions } from "../../helpers/utils";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import InputGroupMask from "../InputGroupMask";
import ListFile from "../ListFile";
import { MasterService } from "../../pages/api/master.service";
import InputGroup from "../InputGroup";
import { isEmpty } from "lodash";
import moment from "moment/moment";
import { EmployeeService } from "../../pages/api/employee.service";
import ImageUploading from 'react-images-uploading';


export default function CardEmployee({ index, employee, timeSheet, onChange, dateSelect, deleteAddOnService, mode, onErrors }) {
    const [errors, setErrors] = useState({});


    const [listFile, setListFile] = useState([])
    const [titleOption, setTitleOption] = useState([])
    const [typeOption, setTypeOption] = useState([])
    const [genderOption, setGenderOption] = useState([])
    const [nationalityOption, setNationaliyOption] = useState([])
    const [roleOption, setRoleOption] = useState([])
    const [employeesOption, setEmployeesOption] = useState([])
    const [images, setImages] = useState([]);
    const maxNumber = 69;
    const [employeeDetail, setEmployeeDetail] = useState({});

    useEffect(() => {
        async function fetchData() {
            let _date = dateSelect ? moment(new Date(dateSelect)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')
            // await getEmployeeUnassignList(_date);
            await getConfigList('TITLE');
            await getConfigList('GENDER');
            await getConfigList('NATIONALITY');
            await getConfigList('TYPE');
            await getConfigList('ROLE');

        }
        fetchData()
    }, [])
    useEffect(() => {
        setErrors(onErrors);
    }, [onErrors]);

    const getEmployeeDetail = async (employeeCode) => {
        await EmployeeService.getEmployeeDetail(employeeCode)
            .then((res) => {
                if (res.data.resultCode === 200) {
                    console.log(res.data.resultData);
                    setEmployeeDetail(res.data.resultData[0]);
                    setQuerySuccess(true);
                } else {
                    setEmployeeDetail({});
                    setQuerySuccess(false);
                }
            })
            .catch((err) => {
                console.log("==> list job3");
            });
    };

    const handleChange = (e, index, name) => {
        let obj = {}
        if (name === 'title') {
            let _option = []
            switch (name) {
                case "title":
                    _option = titleOption
                    break;
                case "gender":
                    _option = genderOption;
                    break;
                default:
            }
            obj = _resObjConfig(e.target.value, _option)
            onChange({ target: { name: name, value: obj } }, index, name)
        }
    }

    const handleFileChange = async (e) => {
        e.preventDefault();
        const files = e.target.files
        console.log(files)
        if (files.length > 0) {
            let param = {
                index: listFile.length + 1,
                file: files[0],
                fileName: files[0].name,
                fileSizeKb: files[0].size,
                recordStatus: 'A',
                filePath: files[0].name,
                action: 'add'
            };
            setListFile([...listFile, param])
        }

    }

    const onChangeImg = (imageList, addUpdateIndex, index) => {
        setImages(imageList);
        handleChange(imageList, index, 'planPicture')
    };

    const getConfigList = async (code) => {
        let param = {
            subType: code
        }
        await MasterService.getConfig(param).then(res => {
            if (res.data.resultCode === 200) {
                console.log(res.data)
                if (code === 'TITLE') setTitleOption(res.data.resultData)
                if (code === 'GENDER') setGenderOption(res.data.resultData)
                if (code === 'NATIONALITY') setNationaliyOption(res.data.resultData)
                if (code === 'TYPE') setTypeOption(res.data.resultData)
                if (code === 'ROLE') setRoleOption(res.data.resultData)
            } else {
                if (code === 'TITLE') setTitleOption([])
                if (code === 'GENDER') setGenderOption([])
                if (code === 'NATIONALITY') setNationaliyOption([])
                if (code === 'TYPE') setTypeOption([])
                if (code === 'ROLE') setRoleOption([])
            }
        }).catch(err => {
        })
    }
    return (
        <div className="mt-4 flex flex-col">
            {mode != 'edit' && <div className="flex flex-row-reverse py-2 px-2 border border-gray-200 rounded-t-md">
                <button type="button"
                    className="flex justify-center inline-flex items-center rounded-md border border-transparent  text-xs font-medium text-black shadow-sm hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-80"
                    onClick={(e) => deleteAddOnService(employee.index)}
                >
                    <XMarkIcon className="h-8 w-8  pointer" aria-hidden="true" />
                </button>

            </div>}
            <div className="rounded-md p-4 shadow-md">
                {/* items-stretch overflow-hidden */}
                {/* {querySucess && */}
                <div className="flex flex-1 items-stretch">
                    <div className='relative w-0 flex-1 mr-6 border-r'>
                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mr-6">
                            <InputSelectGroup type="text" label="คำนำหน้า"
                                id={"title" + employee.index}
                                name="title"
                                onChange={(e) => handleChange(e, index, "title")}
                                options={renderOptions(titleOption, "value1", "code")}
                                isSearchable
                                value={employee.title.code}
                                invalid={
                                    errors?.title ? errors?.title[employee.index] : false
                                }
                                required />
                            <InputGroup
                                type="text"
                                label="ชื่อจริง"
                                id={"firstName" + employee.index}
                                name="firstName"
                                onChange={(e) => onChange(e, index, "firstName")}
                                value={employee.firstName}
                                required
                                invalid={
                                    errors?.firstName ? errors?.firstName[employee.index] : false
                                }
                            />
                            <InputGroup type="text" label="นามสกุล"
                                required
                                id={"lastName" + employee.index}
                                name="lastName"
                                value={employee.lastName}
                                onChange={(e) => onChange(e, index, "lastName")}
                                invalid={
                                    errors?.lastName ? errors?.lastName[employee.index] : false
                                }
                            />
                            <InputGroup type="text" label="ชื่อเล่น"
                                id="nickName"
                                name="nickName"
                                value={employee.nickName}
                                onChange={(e) => onChange(e, index, "nickName")}
                            />
                            <InputSelectGroup type="text" label="เพศ"
                                id={"gender" + employee.index}
                                name="gender"
                                options={renderOptions(genderOption, "value1", "code")}
                                onChange={(e) => handleChange(e, index, "gender")}
                                isSearchable
                                value={employee.gender.code}
                                invalid={
                                    errors?.gender ? errors?.gender[employee.index] : false
                                }
                                required />

                            <InputGroupDate
                                type="date" id={"startDate"} name="startDate" label="วันเกิด"
                                format="YYYY-MM-DD"
                                onChange={(e) => { getEmployeeUnassignList(e.target.value); onChange(e, index, "startDate") }}
                                value={moment().format('YYYY-MM-DD')}
                            />
                            <InputSelectGroup type="text" label="สัญชาติ"
                                id={"nationality" + employee.index}
                                options={renderOptions(nationalityOption, "value1", "code")}
                                onChange={(e) => handleChange(e, index, "nationality")}
                                isSearchable
                                value={employee.nationality?.code}
                                invalid={
                                    errors?.nationality ? errors?.nationality[employee.index] : false
                                }
                                required />

                            <InputGroup type="text" label="เบอร์โทรติดต่อ 1"
                                id="phoneContact1"
                                name="phoneContact1"
                                onChange={(e) => onChange(e, "phoneContact1")}
                                value={employee.phoneContact1}
                            />
                            <InputGroup type="text" label="เบอร์โทรติดต่อ 2"
                                id="phoneContact2"
                                name="phoneContact2"
                                onChange={(e) => onChange(e, "phoneContact2")}
                                value={employee.phoneContact2}
                            />
                        </div>
                        <hr className="mt-5 mb-2"></hr>
                        <div className="flex flex-1 items-stretch">
                            <div className='relative w-0 flex-1 mr-6 border-r'>
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mr-6">

                                    <InputSelectGroup type="text" label="ประเภทพนักงาน"
                                        id={"employeeType" + employee.index}
                                        name="employeeType"
                                        onChange={(e) => handleChange(e, index, "employeeType")}
                                        isSearchable
                                        value={employee.employeeType.code}
                                        options={renderOptions(typeOption, "value1", "code")}
                                        invalid={
                                            errors?.employeeType ? errors?.employeeType[employee.index] : false
                                        }
                                        required />
                                    <InputSelectGroup type="text" label="ตำแหน่งงาน"
                                        id={"employeeRole" + employee.index}
                                        name="employeeRole"
                                        onChange={(e) => handleChange(e, index, "employeeRole")}
                                        isSearchable
                                        options={renderOptions(roleOption, "value1", "code")}
                                        value={employee.employeeRole.code}
                                        invalid={
                                            errors?.employeeRole ? errors?.employeeRole[employee.index] : false
                                        }
                                        required />
                                    <InputGroupDate
                                        type="date"
                                        id={"startDate" + employee.index}
                                        name="startDate" label="วันเริ่มงาน"
                                        format="YYYY-MM-DD"
                                        onChange={(e) => { onChange(e, index, "startDate") }}
                                        value={employee.startDate ? moment(employee.startDate).format('YYYY-MM-DD') : null}
                                        invalid={
                                            errors?.startDate ? errors?.startDate[employee.index] : false
                                        }
                                        required />
                                    <InputGroupDate
                                        type="date"
                                        id={"endDate" + employee.index}
                                        name="endDate" label="วันสิ้นสุด"
                                        format="YYYY-MM-DD"
                                        onChange={(e) => { onChange(e, index, "endDate") }}
                                        value={employee.endDate ? moment(employee.endDate).format('YYYY-MM-DD') : null}

                                    />
                                </div>
                            </div>
                            <div className="relative w-0 flex-1">
                                <div className="block w-full">
                                    <ListFile
                                        data={listFile}
                                    />
                                    <label htmlFor="" className="block text-sm font-medium text-gray-700">อัพโหลดไฟล์:</label>
                                    <ImageUploading
                                        value={images}
                                        onChange={(e, addUpdateIndex) => { onChangeImg(e, addUpdateIndex, index) }}
                                        maxNumber={maxNumber}
                                        dataURLKey="data_url"
                                        acceptType={["jpg"]}
                                    >
                                        {({
                                            imageList,
                                            onImageUpload,
                                            onImageRemoveAll,
                                            onImageUpdate,
                                            onImageRemove,
                                            isDragging,
                                            dragProps
                                        }) => (
                                            <div className="upload__image-wrapper ">
                                                <div className="flex items-center justify-center space-x-4">
                                                    {imageList.length <= 0 && <div className="w-100 border rounded-md" for="photo" style={{ textAlign: "center", width: "50%" }} {...dragProps}>
                                                        <div onClick={onImageUpload} className="icon-add-photo" style={{
                                                            backgroundColor: "white",
                                                            width: "max-content",
                                                            margin: "0 auto",
                                                            padding: "0ยป",
                                                            borderRadius: "50%"
                                                        }}>

                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 42 43"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M33.25 12.5413V17.8984C33.25 17.8984 29.7675 17.9163 29.75 17.8984V12.5413H24.5C24.5 12.5413 24.5175 8.97592 24.5 8.95801H29.75V3.58301H33.25V8.95801H38.5V12.5413H33.25ZM28 19.708V14.333H22.75V8.95801H8.75C6.825 8.95801 5.25 10.5705 5.25 12.5413V34.0413C5.25 36.0122 6.825 37.6247 8.75 37.6247H29.75C31.675 37.6247 33.25 36.0122 33.25 34.0413V19.708H28ZM8.75 34.0413L14 26.8747L17.5 32.2497L22.75 25.083L29.75 34.0413H8.75Z"
                                                                    fill="#DF3062"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div onClick={onImageUpload} style={{ color: "#344358", paddingTop: "5px", paddingBottom: "10px" }}>
                                                            <h3 style={{ margin: "0" }}>อัพโหลดรูปภาพ</h3>
                                                            <span>หรือลากไฟล์วางที่นี่</span>
                                                        </div>
                                                    </div>
                                                    }
                                                </div>

                                                <div className="flex items-center justify-center space-x-4 mt-4">
                                                    {imageList.map((image, index) => (

                                                        <div key={index} className="image-item" style={{ textAlign: "center", width: "50%" }}>
                                                            <img src={image.data_url} alt="" width="50%" style={{ textAlign: "center" }} className="p-4 border rounded-md" />
                                                            <hr />
                                                            <div className="flex justify-between ">
                                                                <button
                                                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-2 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                                                                    type="button" onClick={() => onImageUpdate(index)}>
                                                                    <PencilIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                                                                    แก้ไข</button>
                                                                <button
                                                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-2 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                                                                    type="button" onClick={() => onImageRemove(index)}>
                                                                    <TrashIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                                                                    ลบ</button>
                                                            </div>
                                                        </div>

                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </ImageUploading>
                                </div>
                                <div className="block w-full">
                                    <label htmlFor={"remark"} className="block text-sm font-medium text-gray-700">
                                        {"หมายเหตุ:"}
                                    </label>
                                    <textarea
                                        onChange={(e) => onChange(e, index, "remark")}
                                        id="remark" name="หมายเหตุ"
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* } */}
            </div>
        </div >

    )
}