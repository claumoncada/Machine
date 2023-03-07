import { useEffect, useState } from "react";
import { postQuery } from "../../helpers/postQueries";
import { InsertModalMachineTypes } from "./InsertModalMachineTypes";

import "sweetalert2/dist/sweetalert2.min.css";
import { DeleteMachineTypes } from "./DeleteMachineTypes";
import Table from "react-bootstrap/Table";

export const MachineTypes = () => {
    const [deleted, setDeleted] = useState(false);
    const [type, setType] = useState([]);

    const getTypes = async () => {
        const { machineType } = await postQuery({
            query: `query show_types {
                machineType(where: {deleted: {_eq: ${deleted}}}) {
                  name
                  deleted
                }
              }`,
        });
        setType(machineType);
    };

    useEffect(() => {
        getTypes();
    }, [deleted]);

    const delType = async (name, deleted) => {
        const result = await postQuery({
            query: `mutation toggleType {
                update_machineType(where: {name: {_eq: "${name}"}}, _set: {deleted: ${!deleted}}) {
                        affected_rows
                    }
                }`,
        });
        const newTypeList = type.filter((element) => element.name !== name);
        setType(newTypeList);
    };

    const handleDeleted = () => {
        setDeleted(!deleted);
    };

    return (
        <>
            <h3 className="encabezado"> Machine Types</h3>
            <InsertModalMachineTypes getTypes={getTypes} />
            <label> Deleted </label>
            <input type="checkbox" checked={deleted} onChange={handleDeleted} />
            <div>
                <Table striped bordered hover size>
                    <thead>
                        <tr>
                            <th className="colorth"> Name </th>
                            <th className="anchodelete"> Delete </th>
                        </tr>
                    </thead>
                    <tbody>
                    {type.map((type) => (
                                <tr key={type.name}>
                                    <td> {type.name} </td>
                                    <DeleteMachineTypes
                                        name={type.name}
                                        deleted={type.deleted}
                                        delType={delType}
                                    />
                                    {/* <td>
                                            <button onClick={() => delType(type.name)} type="button">Delete</button>
                                        </td> */}
                                </tr>
                            ))}
                    </tbody>
                </Table>

                {
//                    <table align="center" width="100%">
//                        <thead>
//                            <tr>
//                                <th className="colorth"> Name </th>
//                                <th className="colorth2"> Delete </th>
//                            </tr>
//                        </thead>
//                        <tbody>
//                            {type.map((type) => (
//                                <tr key={type.name}>
//                                    <td> {type.name} </td>
//                                    <DeleteMachineTypes
//                                        name={type.name}
//                                        deleted={type.deleted}
//                                        delType={delType}
//                                    />
//                                    {/* <td>
//                                            <button onClick={() => delType(type.name)} type="button">Delete</button>
//                                        </td> */}
//                                </tr>
//                            ))}
//                        </tbody>
//                    </table>
                }
            </div>
        </>
    );
};
