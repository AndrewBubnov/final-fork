import React from 'react'
import Map from "../../Map/Map";
import LiveSearch from "../../LiveSearch/LiveSearch";


const EditAdd = ({name, handleName, editClose, setCoordinates, setValue, value, rejectEdit, header, editing = null}) => {
    return (
        <>
            <Map
                height={200}
                marginTop={'0px'}
            />
            <span className='invitation-top'>{header}</span>
            <LiveSearch
                name={name}
                handleInput={handleName}
                editClose={() => editClose(editing)}
                setCoordinates={setCoordinates}
                setValue={setValue}
                method='post'
                url='/api/points/'
                data={{pointSearchText: value}}
                value={value}
                rejectEdit={rejectEdit}
            />
        </>
    )
}

export default EditAdd

