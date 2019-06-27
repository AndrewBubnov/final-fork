import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { setUserModerationArray, moderatePhotos } from "../../actions/userCreators";
import Spinner from "../Spinner/Spinner";
import ModerateRender from "./ModerateRender/ModerateRender";
import './Moderate.css'

const Moderate = (props) => {
    const [checkboxArray, setCheckboxArray] = useState(null)

    const handleCheckbox = ({ target: {checked}}, index, number) => {
        const array = [...checkboxArray]
        array[index][number] = checked
        setCheckboxArray(array)
    }

    const handleSubmit = (index) => {
        let userIsOkUserPhoto = checkboxArray[index][0] ? 1 : 0
        let userIsOkCarPhoto = props.moderated[index].userCars.length > 0 ? (checkboxArray[index][1] ? 1 : 0) : 1
        const data = {
            userId: Number(props.moderated[index].userId),
            userIsOkUserPhoto,
            userIsOkCarPhoto,
        }
        props.moderatePhotos(data)
    }

    useEffect(() => {
       props.setUserModerationArray()
    }, [])
    useEffect(() => {
        if (props.moderated){
           const array = props.moderated.map(item => ([!!item.userIsOkUserPhoto, !!item.userIsOkCarPhoto]))
           setCheckboxArray(array)
        }
    }, [props.moderated])


    return(
        checkboxArray && checkboxArray.length > 0 ?
            <div className='moderation-container'>
            <ModerateRender
                checkboxArray={checkboxArray}
                moderated={props.moderated}
                handleCheckbox={handleCheckbox}
                handleSubmit={handleSubmit}
            />
            </div>:
            <div className='spinner-top'><Spinner/></div>
    )
}

const mapStateToProps = (state) => {
    return {
        moderated: state.users.moderated
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUserModerationArray: () => dispatch(setUserModerationArray()),
        moderatePhotos: (data) => dispatch(moderatePhotos(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Moderate)