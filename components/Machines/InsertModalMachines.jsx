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

const postMachine = async({id, type, location, operationStartDate}) => {
    const query = `mutation machine{
        insert_machines(
            objects: [{${ id ? `id: ${id},` : ""}
            type: "${type}",
            location: "${location}",
            operationStartDate: "${formatDate(operationStartDate)}"}]) {
          affected_rows
        }
      }`
    const result = await postQuery({query});
    return result;
}

Modal.setAppElement('#root');

export const InsertModalMachines = ({getMachines}) => {

    const [ isOpen, setIsOpen ] = useState(false);
    const [ formSubmitted, setFormSubmitted ] = useState(false);
    const [type, setType] = useState([]);
    
    const getTypes = async() => {
        const {machineType} = await postQuery({
            query: `query show_types {
                machineType(where: {deleted: {_eq: false}}) {
                  name
                }
              }`
        });
        setType(machineType);
    }

    useEffect(() => {
        getTypes();
    }, [])

    const [formValues, setFormValues] = useState({
        id: '',
        type: '',
        location: '',
        operationStartDate: new Date(),
    })

    const typeClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.type.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.type, formSubmitted ])

    const locationClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.location.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.location, formSubmitted ])

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
        getTypes();
    }

    const onCloseModal = () => {
        setIsOpen(false);
        setFormValues({
            id: '',
            type: '',
            location: '',
            operationStartDate: new Date(),
        })
        setFormSubmitted(false);
    }

    const onSubmit = async event  => {
        event.preventDefault();
        const result = await postMachine(formValues);
        if(result && result.insert_machines.affected_rows === 1){
            getMachines();
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
                <h1> Insert Machine </h1>
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
                        <label>Type</label>
                        <select
                            className={`form-control ${typeClass}`}
                            name="type"
                            value={ formValues.machineType}
                            onChange={ onInputChanged }>
                            <option value={""}></option>
                            {
                                type.map( type => (
                                    <option key={type.name} value={type.name}>{type.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="form-group mb-2">
                        <label>Location</label>
                        <input
                            className={`form-control ${locationClass}`}
                            name = "location"
                            value = { formValues.location }
                            onChange={ onInputChanged }
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>Operation Start Date</label>
                        <DatePicker
                            selected={ formValues.operationStartDate}
                            onChange={ (event) => onChangeDate(event, 'operationStartDate') }
                            className="form-control"
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
