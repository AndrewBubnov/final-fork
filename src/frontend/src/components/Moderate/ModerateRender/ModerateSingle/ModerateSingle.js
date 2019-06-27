import React from 'react'
import ZoomPhoto from "../../../ZoomPhoto/ZoomPhoto";
import './ModerateSingle.css'

const ModerateSingle = ({ handleCheckbox, index, item, checked, handleSubmit }) => {

    const carList = item.userCars.map(element => {
        return (
            <div key={element.userCarId}>
                <div>{element.userCarName} {element.userCarColour}</div>
                <ZoomPhoto
                    src={element.userCarPhoto}
                    subject={'car'}
                    height={100}
                />
            </div>
        )
    })

    return (
        <div className='moderation-card'>
            <div>{item.userName}</div>
            <div style={{
                display: 'flex',
                justifyContent: carList.length > 0 ? 'space-between' : 'center',
                width: '100%'
            }}>
                <div className='moderation-photo-column'>
                    <div>{item.userMail}</div>
                    <ZoomPhoto
                        src={item.userPhoto}
                        subject={'user'}
                        height={100}
                    />
                    <input type='checkbox'
                           checked={checked[0]}
                           onChange={(e) => handleCheckbox(e, index, 0)}
                           style={{
                               marginBottom: carList.length > 0 ? 0 : 'auto',
                               marginTop: carList.length > 0 ? 'auto' : 5
                           }}
                    />
                </div>
                <div className='moderation-photo-column'>
                    {carList ? carList : null}
                    {
                        carList.length > 0 &&
                        <input type='checkbox'
                               checked={checked[1]}
                               onChange={(e) => handleCheckbox(e, index, 1)}
                               style={{marginTop: 5}}
                        />
                    }
                </div>
            </div>
            <button
                onClick={() => handleSubmit(index)}
                className='moderation-submit'
            >
                Submit
            </button>
        </div>
    )
}

export default ModerateSingle