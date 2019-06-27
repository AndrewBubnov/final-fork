import React from 'react'
import ModerateSingle from './ModerateSingle/ModerateSingle'

const ModerateRender = ({checkboxArray, moderated, handleCheckbox}) => {
    return (
        moderated.map((item, index) => {
            return (
                    <ModerateSingle
                    key={item.userId}
                    item={item}
                    index={index}
                    checked={checkboxArray[index]}
                    handleCheckbox={handleCheckbox}
                />
            )
        })

    )
}

export default ModerateRender