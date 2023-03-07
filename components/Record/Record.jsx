import { useEffect, useState } from "react";
import { postQuery } from "../../helpers/postQueries";
import { InsertModalRecord } from "./InsertModalRecord";

//import Swal from 'sweetalert2';
import "sweetalert2/dist/sweetalert2.min.css";
import { DeleteRecord } from "./DeleteRecord";
import Table from "react-bootstrap/Table";

export const Record = () => {
    const [deleted, setDeleted] = useState(false);
    const [record, setRecord] = useState([]);

    const getRecord = async () => {
        const { controlMaintenanceRecord } = await postQuery({
            query: `query show_record {
                controlMaintenanceRecord(where: {deleted: {_eq: ${deleted}}}) {
                  id
                  date
                  status
                  machineId
                  managerId
                  observation
                  maintenanceId
                  deleted
                }
              }`,
        });
        setRecord(controlMaintenanceRecord);
    };

    useEffect(() => {
        getRecord();
    }, [deleted]);

    const delRecord = async (id, deleted) => {
        const result = await postQuery({
            query: `mutation toggleRecord {
                update_controlMaintenanceRecord(where: {id: {_eq: ${id}}}, _set: {deleted: ${!deleted}}) {
                  affected_rows
                }
              }`,
        });
        const newRecordList = record.filter((element) => element.id !== id);
        setRecord(newRecordList);
    };

    const handleDeleted = () => {
        setDeleted(!deleted);
    };

    return (
        <>
            <h3 className="encabezado">Control/Maintenance Record</h3>
            <InsertModalRecord getRecord={getRecord} />
            <label> Deleted </label>
            <input type="checkbox" checked={deleted} onChange={handleDeleted} />
            <div>
                <Table striped bordered hover size>
                    <thead>
                        <tr>
                            <th className="colorth"> Id </th>
                            <th className="colorth"> Date </th>
                            <th className="colorth"> Status </th>
                            <th className="colorth"> Machine Id </th>
                            <th className="colorth"> Manager Id </th>
                            <th className="colorth"> Maintenance Id </th>
                            <th className="colorth"> Observation </th>
                            <th className="anchodelete"> Delete </th>
                        </tr>
                    </thead>
                    <tbody>
                    {record.map((record) => (
                                <tr key={record.id}>
                                    <td> {record.id} </td>
                                    <td> {record.date} </td>
                                    <td> {record.status} </td>
                                    <td> {record.machineId} </td>
                                    <td> {record.managerId} </td>
                                    <td> {record.maintenanceId} </td>
                                    <td> {record.observation} </td>
                                    <DeleteRecord
                                        id={record.id}
                                        deleted={record.deleted}
                                        delRecord={delRecord}
                                    />
                                </tr>
                            ))}
                    </tbody>
                </Table>
                {
//                    <table align="center" width="100%">
//                        <thead>
//                            <tr>
//                                <th className="colorth"> Id </th>
//                                <th className="colorth"> Date </th>
//                                <th className="colorth"> Status </th>
//                                <th className="colorth"> Machine Id </th>
//                                <th className="colorth"> Manager Id </th>
//                                <th className="colorth"> Maintenance Id </th>
//                                <th className="colorth"> Observation </th>
//                                <th className="colorth2"> Delete </th>
//                            </tr>
//                        </thead>
//                        <tbody>
//                            {record.map((record) => (
//                                <tr key={record.id}>
//                                    <td> {record.id} </td>
//                                    <td> {record.date} </td>
//                                    <td> {record.status} </td>
//                                    <td> {record.machineId} </td>
//                                    <td> {record.managerId} </td>
//                                    <td> {record.maintenanceId} </td>
//                                    <td> {record.observation} </td>
//                                    <DeleteRecord
//                                        id={record.id}
//                                       deleted={record.deleted}
//                                        delRecord={delRecord}
//                                    />
//                                </tr>
//                            ))}
//                        </tbody>
//                    </table>
                }
            </div>
        </>
    );
};
