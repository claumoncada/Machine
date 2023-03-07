export const DeleteMachineTypes = ({name, deleted, delType}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delType(name, deleted)} className="buttonrestore">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delType(name, deleted)} className="buttondelete">Delete</button>
            </td>
        )
    }
}
