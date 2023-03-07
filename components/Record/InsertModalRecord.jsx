import {useMemo, useState, useEffect} from 'react';
import {postQuery} from '../../helpers/postQueries';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from 'react-bootstrap/Button';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('/');
}

const postRecord = async({id, date, status, machineId, managerId, observation, maintenanceId}) => {
    const query = `mutation ctrlMaintenanceRec {
        insert_controlMaintenanceRecord(
            objects: [{${ id ? `id: ${id},` : ""}
            date: "${formatDate(date)}",
            status: "${status}", 
            machineId: "${machineId}",
            managerId: "${managerId}",
            maintenanceId: "${maintenanceId}",
            observation: "${observation}"}]) {
          affected_rows
        }
      }`
    const result = await postQuery({query});
    return result;
}

Modal.setAppElement('#root');

export const InsertModalRecord = ({getRecord}) => {

    const [ isOpen, setIsOpen ] = useState(false);
    const [ formSubmitted, setFormSubmitted ] = useState(false);
    const [machine, setMachine] = useState([]);
    const [maintenance, setMaintenance] = useState([]);

    const getMachines = async() => {
        const {machines} = await postQuery({
            query: `query show_machine {
                machines(where: {deleted: {_eq: false}}) {
                  id
                  location
                  operationStartDate
                  type
                  deleted
                }
              }`
        });
        setMachine(machines);
    }

    const getMaintenances = async() => {
        const {maintenances} = await postQuery({
            query: `query show_maintenances {
                maintenances(where: {deleted: {_eq: false}}) {
                  id
                  machineType
                  frequency
                  type
                  deleted
                }
              }`
        });
        setMaintenance(maintenances);
    }

    useEffect(() => {
        getMachines();
        getMaintenances();
    }, [])
    
    const [formValues, setFormValues] = useState({
        id: '',
        date: new Date(),
        status: '',
        machineId: '',
        managerId: '',
        maintenanceId: '',
        observation: '',
    })

    const statusClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.status.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.status, formSubmitted ])

    const machineIdClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.machineId.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.machineId, formSubmitted ])

    const managerIdClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.managerId.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.managerId, formSubmitted ])

    const maintenanceIdClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.maintenanceId.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.maintenanceId, formSubmitted ])

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onChangeDate = ( event, changing ) => {
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    const onOpenModal = () => {
        setIsOpen(true);
        getMachines();
        getMaintenances();
    }

    const onCloseModal = () => {
        setIsOpen(false);
        setFormValues({
            id: '',
            date: new Date(),
            status: '',
            machineId: '',
            managerId: '',
            maintenanceId: '',
            observation: '',
        })
        setFormSubmitted(false);
    }

    const onSubmit = async event  => {
        event.preventDefault();

        const result = await postRecord(formValues);
        if(result && result.insert_controlMaintenanceRecord.affected_rows === 1){
            getRecord()
            onCloseModal();
        } else {
            Swal.fire('Insert error', 'Please check all fields are correct', 'Please check all fields are correct');
            setFormSubmitted(true);
        }
    }

    return (
        <>
            <Button onClick={ onOpenModal } variant="outline-primary" className="buttonprueba">Add</Button>{' '}
            <Modal
                isOpen={isOpen}
                onRequestClose={ onCloseModal }
                style={customStyles}
            >
                <h1> Insert Record </h1>
                <hr />
                <form className="container" onSubmit={ onSubmit }>

                    <div className="form-group mb-2">
                        <label>Id</label>
                        <input
                            className="form-control"
                            name = "id"
                            value = { formValues.id }
                            onChange={ onInputChanged }
                        />

                    </div>

                    <div className="form-group mb-2">
                        <label>Date</label>
                        <DatePicker
                            selected={ formValues.date}
                            onChange={ (event) => onChangeDate(event, 'date') }
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>Status</label>
                        <select 
                            className={`form-control ${statusClass}`}
                            name = "status"
                            value={ formValues.status }
                            onChange={onInputChanged}>
                            <option value={""}></option>
                            <option value={"Done"}>Done</option>
                            <option value={"To do"}>To do</option>
                            <option value={"In progress"}>In progress</option>
                        </select>
                    </div>

                    <div className="form-group mb-2">
                        <label>Machine ID</label>
                        <select 
                            className={`form-control ${machineIdClass}`}
                            name = "machineId"
                            value={ formValues.machineId }
                            onChange={onInputChanged}>
                            <option value={""}></option>
                            {
                                machine.map( machine => (
                                    <option key={machine.id} value={machine.id}>{machine.id}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="form-group mb-2">
                        <label>Manager ID</label>
                        <input
                            className={`form-control ${managerIdClass}`}
                            name = "managerId"
                            value = { formValues.managerId }
                            onChange={ onInputChanged }
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>Maintenance ID</label>
                        <select 
                            className={`form-control ${maintenanceIdClass}`}
                            name = "maintenanceId"
                            value={ formValues.maintenanceId }
                            onChange={onInputChanged}>
                            <option value={""}></option>
                            {
                                maintenance.map( maintenance => (
                                    <option key={maintenance.id} value={maintenance.id}>{maintenance.id}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="form-group mb-2">
                        <label>Observation</label>
                        <input
                            className={`form-control`}
                            name = "observation"
                            value = { formValues.observation }
                            onChange={ onInputChanged }
                        />
                    </div>

                   <button
                        type="submit"
                        className="btn btn-outline-primary btn-block"
                    >
                        <i className="far fa-save"></i>
                        <span> Save </span>
                    </button>

                </form>
            </Modal>
        </>
    )
}
