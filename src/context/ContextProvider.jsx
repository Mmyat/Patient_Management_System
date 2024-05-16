import { createContext, useContext, useState} from "react"
const StateContext = createContext();
const ContextProvider = ({children}) => {
    const [patientId,setPatientId] = useState(null)
    const [formId,setFormId] = useState(null)
    const data = {patientId,setPatientId}
  return (
    <StateContext.Provider value={data}>
        {children}
    </StateContext.Provider>
  )
}

export default ContextProvider
export const useStateContext =()=> useContext(StateContext)