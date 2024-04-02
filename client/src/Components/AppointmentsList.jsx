import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_APPOINTMENTS } from '../utils/queries';
import { DELETE_APPOINTMENT, UPDATE_APPOINTMENT } from '../utils/mutations';
import ModifyAppointmentForm from './ModifyAppointmentForm';

const AppointmentsList = () => {
    const { loading, error, data } = useQuery(GET_ALL_APPOINTMENTS);
    const [orderBy, setOrderBy] = useState('date');
    const [modifiedAppointments, setModifiedAppointments] = useState({});
    const [deleteAppointment, { loading: deleting, error: deleteError }] = useMutation(DELETE_APPOINTMENT, {
        refetchQueries: [{ query: GET_ALL_APPOINTMENTS }],
    });
    const [updateAppointment] = useMutation(UPDATE_APPOINTMENT, {
        refetchQueries: [{ query: GET_ALL_APPOINTMENTS }],
    });

    const handleModify = (_id, barber_name, date, time, service) => {
        setModifiedAppointments(prevState => ({
            ...prevState,
            [_id]: { _id, barber_name, date, time, service } // Use _id directly for clarity
        }));
    };

    const handleDelete = async (id) => {
        try {
            await deleteAppointment({ variables: { id } });
        } catch (error) {
            console.error("Error deleting appointment:", error);
        }
    };

const handleSubmit = async ({ _id, barberName, date, time, service }) => {
    try {
        await updateAppointment({
            variables: {
                id: _id, 
                input: { barber_name: barberName, date, time, service },
            },
        });
        console.log('Appointment updated successfully');
    } catch (error) {
        console.error('Error updating appointment:', error); // ahh what the hell am i missing here backend is returning a 400 error but i don't know why! everything looks lined up with the schema and resolver and typeDefs probably some variable name is off
    }
};

    const handleCancel = (id) => {
        setModifiedAppointments(prevState => {
            const newState = { ...prevState };
            delete newState[id];
            return newState;
        });
    };

    const handleOrderByChange = (event) => {
        setOrderBy(event.target.value);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data || !data.appointments || data.appointments.length === 0) {
        return <p>No appointments found.</p>;
    }

    const sortedAppointments = data.appointments.slice().sort((a, b) => {
        switch (orderBy) {
            case 'date':
                return new Date(a.date) - new Date(b.date);
            case 'barber':
                return a.barber_name.localeCompare(b.barber_name);
            default:
                return 0;
        }
    });

    return (
        <div className="container custom-scrollbar md:max-h-[408px] px-16 h-screen overflow-y-auto mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>All Customer Appointments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <label htmlFor="orderBy" className="block text-sm font-medium text-white 500" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>Order By:</label>
                <select id="orderBy" name="orderBy" className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleOrderByChange}>
                    <option value="date">Date</option>
                    <option value="barber">Barber</option>
                </select>
            </div>

            {sortedAppointments.map(({ _id, barber_name, date, time, service, user }) => (
                <div key={_id} className="bg-blue-100 shadow-md rounded p-4 flex items-center mr-44 ml-44 border border-black border-4">
                    <div>
                        <p className="font-bold ml-12">Barber: {barber_name}</p>
                        <p className="font-semibold ml-12">Service: {service}</p>
                        <p className="font-semibold ml-12">Date: {date}</p>
                        <p className="font-semibold ml-12">Time: {time}</p>
                        {user && (
                            <div className="mt-4 border-t pt-2">
                                <h3 className="text-center font-semibold">Customer: {user.user_name}</h3>
                                <p className=" font-semibold ml-12">Email: {user.email}</p>
                            </div>
                        )}
                    </div>
                    <div className="ml-auto">
                        <div>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-900 transition duration-300 mr-24"
                                onClick={() => handleModify(_id, barber_name, date, time, service)}
                            >
                                Modify
                            </button>
                            {modifiedAppointments[_id] && (
                                <ModifyAppointmentForm
                                    modifiedAppointment={modifiedAppointments[_id]}
                                    handleSubmit={handleSubmit}
                                    handleCancel={handleCancel}
                                    appointmentId={_id}
                                />
                            )}
                        </div>
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-900 transition duration-300 mr-24"
                            onClick={() => handleDelete(_id)}
                            disabled={deleting}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
            {deleteError && <p>Error deleting appointment. Please try again.</p>}
        </div>
    );
};

export default AppointmentsList;
