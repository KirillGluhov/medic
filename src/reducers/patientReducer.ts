import { SET_PATIENT_ID } from "../actions/patientActions";

interface PatientState
{
    patientId: string | null
}

const initialState: PatientState = {
    patientId: null
}

const patientReducer = (state = initialState, action: any): PatientState => {
    switch (action.type) {
        case SET_PATIENT_ID:
            return {
                ...state,
                patientId: action.payload
            }
        default:
            return state;
    }
}

export default patientReducer;