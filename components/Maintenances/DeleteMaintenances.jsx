export const DeleteMaintenances = ({id, deleted, delMaintenance}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delMaintenance(id, deleted)} className="buttonrestore">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delMaintenance(id, deleted)} className="buttondelete">Delete</button>
            </td>
        )
    }  
}
