import * as spotsActions from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'

function DeleteSpotConfirmed ({id}) {
    const dispatch = useDispatch()
    const history = useHistory()

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch(spotsActions.deleteSpot(id))
        history.push('/')
    }

    return (
        <div onClick={handleClick}>
            Confirm
        </div>
    )
}

export default DeleteSpotConfirmed