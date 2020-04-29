import {SET_MEDIA_TYPE} from "../../actions/mediaType_actions";

const initialState = "movie";

export default (state = initialState, action) => {

    switch(action.type) {
        case SET_MEDIA_TYPE:
            return action.mediaType;
        default:
            return state;
    }
}