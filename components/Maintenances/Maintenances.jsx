import { useEffect, useState } from "react";
import { postQuery } from "../../helpers/postQueries";
import { DeleteMaintenances } from "./DeleteMaintenances";
import { InsertModalMaintenances } from "./InsertModalMaintenances";
import Table from 'react-bootstrap/Table';

export const Maintenances = () => {
    const [deleted, setDeleted] = useState(false);
    const [maintenance, setMaintenance] = useState([]);

    const getMaintenances = async () => {
        const { maintenances } = await postQuery({
            query: `query show_maintenances {
                maintenances(where: {deleted: {_eq: ${deleted}}}) {
                  id
                  machineType
                  frequency
                  type
                  deleted
                }
              }`,
        });
        setMaintenance(maintenances);
    };

    useEffect(() => {
        getMaintenances();
    }, [deleted]);

    const delMaintenance = async (id, deleted) => {
        const result = await postQuery({
            query: `mutation toggleMaintenance {
                update_maintenances(where: {id: {_eq: ${id}}}, _set: {deleted: ${!deleted}}) {
                  affected_rows
                }
              }`,
        });
        const newMaintenanceList = maintenance.filter(
            (element) => element.id !== id
        );
        setMaintenance(newMaintenanceList);
    };

    const handleDeleted = () => {
        setDeleted(!deleted);
    };

    return (
        <>
            <h3 className="encabezado"> Maintenance Types</h3>
            <InsertModalMaintenances getMaintenances={getMaintenances} />
            <label> Deleted </label>
            <input type="checkbox" checked={deleted} onChange={handleDeleted} />
            <div>
                <Table striped bordered hover size>
                    <thead>
                        <tr>
                            <th className="colorth"> Id </th>
                            <th className="colorth"> Maintenance Type </th>
                            <th className="colorth"> Machine Type </th>
                            <th className="colorth"> Frequency </th>
                            <th className="anchodelete"> Delete </th>
                        </tr>
                    </thead>
                    <tbody>
                    {maintenance.map((maintenance) => (
                                <tr key={maintenance.id}>
                                    <td> {maintenance.id} </td>
                                    <td> {maintenance.type} </td>
                                    <td> {maintenance.machineType} </td>
                                    <td> {maintenance.frequency} </td>
                                    <DeleteMaintenances
                                        id={maintenance.id}
                                        deleted={maintenance.deleted}
                                        delMaintenance={delMaintenance}
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
//                                <th className="colorth"> Maintenance Type </th>
//                                <th className="colorth"> Machine Type </th>
//                                <th className="colorth"> Frequency </th>
//                                <th className="colorth2"> Delete </th>
//                            </tr>
//                        </thead>
//                        <tbody>
//                            {maintenance.map((maintenance) => (
//                                <tr key={maintenance.id}>
//                                    <td> {maintenance.id} </td>
//                                    <td> {maintenance.type} </td>
//                                    <td> {maintenance.machineType} </td>
//                                    <td> {maintenance.frequency} </td>
//                                    <DeleteMaintenances
//                                        id={maintenance.id}
//                                        deleted={maintenance.deleted}
//                                        delMaintenance={delMaintenance}
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
