import Layout from "../../layouts"
import LoadingOverlay from "react-loading-overlay"
import { useForm } from "react-hook-form";
import { CardBasic, InputGroup, InputGroupDate, InputRadioGroup, InputSelectGroup } from "../../components";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import { useRouter } from "next/router";
import { renderOptions } from "../../helpers/utils";
import CardTimesheet from "../../components/time-sheet/CardTimesheet";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import Breadcrumbs from "../../components/Breadcrumbs";
import moment from 'moment'
import { OperationsService } from "../api/operations.service";
import { NotifyService } from "../api/notify.service";
const initial = {
    jobDetail: {},
    wageType: {
        code: 'MD0024',
        value1: "รายวัน",
        value2: "daily"
    },
    operationStatus: {
        "code": "MD0027",
        "value1": "รอการอนุมัติ",
        "value2": "รอการอนุมัติ"
    },
    task: {},
    employee: {},
    subBranch: {
        "_id": "64c1557f95d25869bb895389",
        "branchCode": "BC10001",
        "branchName": "ทรัพย์ประเมิน",
        "branchType": {
            "code": "MD0023",
            "value1": "แปลงย่อย"
        }
    },
    mainBranch: {
        "_id": "64c1557f95d25869bb89538a",
        "branchCode": "BC10002",
        "branchName": "บ้านแหลม",
        "branchType": {
            "code": "MD0022",
            "value1": "แปลงใหญ่"
        }
    },
    inventory: [{
        index: 1,
        inventoryCode: "",
        inventoryName: "",
        unit: "",
        pickupAmount: ""
    }]
}
export default function DetailOperation() {
    const breadcrumbs = [{ index: 1, href: '/operations', name: 'บันทึกการทำงาน' }, { index: 2, href: '/operations', name: 'สร้างบันทึก' }]
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const [mode, setMode] = useState(router.query["mode"])
    const [jobDetail, setJobDetail] = useState(initial.jobDetail)
    const [timeSheetForm, setTimeSheetForm] = useState([{
        index: 1,
        startDate: moment(new Date).format('YYYY-MM-DD'),
        employee: {},
        mainBranch: initial.mainBranch,
        subBranch: initial.subBranch,
        task: initial.task,
        inventory: initial.inventory,
        wageType: initial.wageType,
        operationStatus: initial.operationStatus
    }])
    const createValidationSchema = () => {
    }
    const validationSchema = createValidationSchema();
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm(formOptions);
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const handleSave = async () => {
        setLoading(true)
        console.log(timeSheetForm)
        let dataList = {
            dataList: timeSheetForm
        }
        await OperationsService.createOperations(dataList).then(res => {
            if (res.data.resultCode === 200) {
                NotifyService.success('Create Success')
                router.push('/operations');
            } else {
                NotifyService.error(res.data.resultDescription)
            }
        })
        setLoading(false)
    }
    const onChange = (e, index, name,) => {
        console.log('dddddddddddddd', JSON.parse(JSON.stringify(e.target.value)), index, name)
        let _newValue = [...timeSheetForm]
        _newValue[index][name] = e.target.value
        setTimeSheetForm(_newValue)
    }

    const deleteAddOnService = (rowIndex) => {
        console.log("rowIndex", rowIndex)
        // let newData = newData.filter((_, i) => i != rowIndex - 1)
        const newData = timeSheetForm.filter(item => item.index !== rowIndex);
        console.log("newData", newData)
        setTimeSheetForm(newData)
    }
    const insertAddOnService = async () => {
        if (timeSheetForm.length === 10) {
            NotifyService.error("สามารถเพิ่มสูงสุด 10 รายการ")
            return
        }
        let lastElement = timeSheetForm.length > 0 ? timeSheetForm[timeSheetForm.length - 1] : { index: 0 };
        let newService = {
            index: lastElement.index + 1,
            startDate: moment(new Date).format('YYYY-MM-DD'),
            employee: initial.employee,
            mainBranch: initial.mainBranch,
            subBranch: initial.subBranch,
            task: initial.task,
            inventory: initial.inventory,
            wageType: initial.wageType,
            operationStatus: initial.operationStatus
        }
        setTimeSheetForm((timeSheet) => [...timeSheet, newService]);
        console.log(newService)
    }
    return (
        <Layout>
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
                <Breadcrumbs title="Job Detail" breadcrumbs={breadcrumbs} />
                <div className="md:container md:mx-auto">
                    <form className="space-y-4" id='inputForm'>
                        {timeSheetForm && timeSheetForm.map((timeSheet, index) => {
                            return (
                                <CardTimesheet index={index} timeSheet={timeSheet} onChange={onChange} deleteAddOnService={deleteAddOnService} />
                            )
                        })}
                    </form>
                    <div className="flex flex-row-reverse pt-4">
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-indigo-800 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-80"
                            onClick={insertAddOnService} >
                            <PlusCircleIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                            เพิ่มบันทึก
                        </button>
                    </div>
                    <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
                        <div className="flex justify-center items-center overflow-y-auto p-4" >
                            <div className="flex justify-center items-center">
                                <button type="button"
                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                    onClick={() => { router.push('/operations'); }}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="button"
                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={handleSave}
                                >
                                    บันทึก
                                </button>
                            </div>
                        </div>

                    </footer>

                </div>
            </LoadingOverlay >
        </Layout >
    )
}