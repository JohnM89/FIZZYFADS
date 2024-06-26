import { useState } from 'react';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { UPDATE_APPOINTMENT } from '../utils/mutations';

const ModifyAppointmentForm = ({ modifiedAppointment, onClose, refetch }) => {
    const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);
    const [barberName, setBarberName] = useState(modifiedAppointment.barber_name);
    const [date, setDate] = useState(new Date(modifiedAppointment.date));
    const [time, setTime] = useState(modifiedAppointment.time);
    const [service, setService] = useState(modifiedAppointment.service);
    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        console.log("Next step clicked");
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        try {
            await updateAppointment({
                variables: {
                    id: modifiedAppointment._id,
                    barberName,
                    date,
                    time,
                    service,
                },
            });
            console.log('Appointment updated successfully');
            onClose();
            await refetch();

        } catch (error) {
            console.error('Error updating appointment:', error.message);
        }
    };


    console.log("Rendering ModifyAppointmentForm");

    return (
        <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
            {step === 1 && (
                <div>
                    <label className="block mb-2 font-bold">Barber Name:</label>
                    <div className="flex space-x-2">
                        <button className="px-2 py-2 bg-red-200 text-black rounded hover:bg-red-400 transition duration-100 btn" onClick={() => setBarberName("JOHN_DOE")}>JOHN DOE</button>
                        <button className="px-2 py-2 bg-red-200 text-black rounded hover:bg-red-400 transition duration-100 btn" onClick={() => setBarberName("JANE_DAWN")}>JANE DAWN</button>
                        <button className="px-2 py-2 bg-red-200 text-black rounded hover:bg-red-400 transition duration-100 btn" onClick={() => setBarberName("WILLIAM_WILLIAMS")}>WILLIAM WILLIAMS</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <label className="block mb-2 font-bold">Service:</label>
                    <div className="flex flex-wrap">
                        <button className="px-2 py-2 bg-red-200 text-black rounded hover:bg-red-400 transition duration-100 btn" onClick={() => setService("Traditional Mens Cut")}>Traditional Mens Cut</button>
                        <button className="px-2 py-2 bg-red-200 text-black rounded hover:bg-red-400 transition duration-100 btn" onClick={() => setService("Straight Razor")}>Straight Razor</button>
                        <button className="px-2 py-2 bg-red-200 text-black rounded hover:bg-red-400 transition duration-100 btn" onClick={() => setService("Fitzys Fade")}>Fitzys Fade</button>
                        <button className="px-2 py-2 bg-red-200 text-black rounded hover:bg-red-400 transition duration-100 btn" onClick={() => setService("Buzzcut")}>Buzzcut</button>
                        <button className="px-2 py-2 bg-red-200 text-black rounded hover:bg-red-400 transition duration-100 btn" onClick={() => setService("Kidz Kutz")}>Kidz Kutz</button>
                        <button className="px-2 py-2 bg-red-200 text-black rounded hover:bg-red-400 transition duration-100 btn" onClick={() => setService("Braid-UP")}>Braid-UP</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <label className="block mb-2 font-bold">Date:</label>
                    <Calendar onChange={setDate} value={date} />
                </div>
            )}

            {step === 4 && (
                <div>
                    <label className="block mb-2 font-bold">Time:</label>
                    <input type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
            )}

            {step <= 3 && (
                <div className="mt-4 flex justify-between">
                    <button className="btn" onClick={handleNextStep}>Next</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            )}

            {step === 4 && (
                <div className="mt-4 flex justify-between">
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            )}
        </div>
    );
};

// props validation
ModifyAppointmentForm.propTypes = {
    modifiedAppointment: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,
};

export default ModifyAppointmentForm;
