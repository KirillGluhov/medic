export const SET_PATIENT_ID = 'SET_PATIENT_ID';

export const setPatientId = (patientId: string) => ({
    type: SET_PATIENT_ID,
    payload: patientId
})