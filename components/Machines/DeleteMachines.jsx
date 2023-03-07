export const DeleteMachines = ({id, deleted, delMachine}) => {
    if (deleted){
        return (
            <td>  
                <button onClick={() => delMachine(id, deleted)} className="buttonrestore">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delMachine(id, deleted)} className="buttondelete">Delete</button>
            </td>
        )
    }   
}
