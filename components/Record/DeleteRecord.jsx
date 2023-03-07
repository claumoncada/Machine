export const DeleteRecord = ({id, deleted, delRecord}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delRecord(id, deleted)} className="buttonrestore">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delRecord(id, deleted)} className="buttondelete">Delete</button>
            </td>
        )
    }   
}
