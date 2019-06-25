import React, {useState} from 'react'
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ZoomPhoto from '../../../ZoomPhoto/ZoomPhoto'
import './MainRoute.css'


const MainRoute = ({setUserMainTripShown, setCurrentMainTripParams, mainTripParams, index, mainTripUserArray, joinStatusArray, item, classes}) => {
    const [expanded, setExpanded] = useState(false)
    let timeout = null;
    let startTouch = 0;

    const touchStart = () => {
        timeout = setTimeout(() => setExpanded(!expanded), 300)
        startTouch = Date.now()
    }

    const touchEnd = () => {
        if (Date.now() - startTouch < 300) clearTimeout(timeout)
    }

    const contextMenuDisable = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    const mouseDown = () => {
        if (window.innerWidth > 710) setExpanded(!expanded)
    }

    const setTabStyle = (index) => {
        switch (joinStatusArray[index]) {
            case 1:
            case 2:
                return 'selected'
            case 3:
                return 'mutual'
            default:
                return 'unselected'
        }
    }


    let tabContent = null
    const mainTrip = mainTripUserArray[index]
    if (mainTrip.userCar) {
        tabContent = (
            <>
                <div className='companion-details-center'>
                    {mainTrip.userName}
                </div>
                <div className='companion-details-center'>
                    <a className='phone-link' style={style[setTabStyle(index)]}
                       href={`tel:${mainTrip.userPhone}`}>{mainTrip.userPhone}</a>
                </div>
                <div className='companion-details-center'>
                    {mainTrip.userCar ? mainTrip.userCar.userCarName + ' ' + mainTrip.userCar.userCarColour : null}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', position: 'relative'}}>
                    <div>
                        {mainTrip.userCar.userCarPhoto ?
                            <ZoomPhoto
                                src={mainTrip.userCar.userCarPhoto}
                                subject={'car'}
                                height={100}
                            /> :
                            null}
                    </div>
                    <div>
                        <ZoomPhoto
                            src={mainTrip.userPhoto}
                            subject={'user'}
                            height={100}
                        />
                    </div>
                </div>
            </>
        )
    } else {
        tabContent = (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    <div className='companion-details companion-details-left'>
                        {mainTrip.userName}
                    </div>
                    <div className='companion-details companion-details-left'>
                        <a className='phone-link' style={style[setTabStyle(index)]}
                           href={`tel:${mainTrip.userPhone}`}>{mainTrip.userPhone}</a>
                    </div>
                </div>
                <div className='companion-details companion-details-right'>
                    <ZoomPhoto
                        src={mainTrip.userPhoto}
                        subject={'user'}
                        height={100}
                    />
                </div>
            </div>
        )
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(mainTrip.tripDateTime)
    const stringDate = date.getDate() + ' ' + monthNames[date.getMonth() + 1] + ' ' + date.getFullYear()
    const stringTime = date.getHours() + ' : ' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())

    return (
        <ExpansionPanel
            className={classes.root}
            expanded={expanded}
            onTouchStart={touchStart}
            onTouchEnd={touchEnd}
            onContextMenu={contextMenuDisable}
            onMouseDown={mouseDown}
        >
            <ExpansionPanelSummary
                onClick={() => {
                    setUserMainTripShown(false);
                    setCurrentMainTripParams(mainTripParams[index + 1])
                }}
                expandIcon={<ExpandMoreIcon className={classes.expandIcon}/>}
                style={style[setTabStyle(index)]}
            >
                <div>
                    <div className='date-time-container'>
                        <span style={style[setTabStyle(index)]}>{stringDate}</span>
                        <span style={style[setTabStyle(index)]}>{stringTime}</span>
                    </div>
                    <Typography className={classes.heading}>{item[0]} - {item[item.length - 1]}</Typography>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details} style={style[setTabStyle(index)]}>

                {tabContent}

            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}

const style = {
    unselected: {
        backgroundColor: '#fff',
        color: '#1A1A1A'
    },
    selected: {
        backgroundColor: '#F59F49',
        color: '#fff',
    },
    mutual: {
        backgroundColor: '#338033',
        color: '#fff',
    },
}
const styles = theme => ({
    root: {
        width: '85%',
        borderRadius: 4,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    expandIcon: {
        color: '#1A1A1A',
    },
    details: {
        display: 'block',
    },
});

MainRoute.propTypes = {
    setCurrentMainTripParams: PropTypes.func,
    mainTripParams: PropTypes.array,
    index: PropTypes.number,
    mainTripUserArray: PropTypes.array,
    joinStatusArray: PropTypes.array,
    item: PropTypes.array,
    classes: PropTypes.object,
}

MainRoute.defaultProps = {
    mainTripUserArray: [],
}

export default withStyles(styles)(MainRoute)
