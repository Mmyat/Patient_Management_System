import { useState, useEffect } from 'react';
// import { LocalizationProvider, DatePicker } from '@mui/lab';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { parse } from 'date-fns';
const Calender = () => {
    const [selectedDate, setSelectedDate] = useState('');

    const fetchDateFromAPI = async () => {
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();
        const dateString ="2000/05/07"; // Assuming the date is in data.date in 'YYYY/MM/DD' format
        return parse(dateString, 'yyyy/MM/dd', new Date());
        // return "2000/05/07";
    };
    useEffect(() => {
        const getDate = async () => {
            const date = await fetchDateFromAPI();
            setSelectedDate(date);
        };

        getDate();
    }, []);
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Select Date"
                value={selectedDate || null}
                onChange={(newValue) => {
                    setSelectedDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}

export default Calender