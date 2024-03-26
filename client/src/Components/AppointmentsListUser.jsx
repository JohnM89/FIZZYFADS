import { useQuery } from '@apollo/client';
import { GET_USER_MOST_RECENT_APPOINTMENT } from '../utils/queries';
import { useAuth } from '../utils/authContext';

const AppointmentsListUser = () => {
  const { userProfile } = useAuth();

  const { loading, error, data } = useQuery(GET_USER_MOST_RECENT_APPOINTMENT, {
    variables: { userId: userProfile._id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.userMostRecentAppointment) {
    return <p>No appointment yet bud.</p>;
  }

  const appointment = data.userMostRecentAppointment;

  return (
    <div className="container md:max-h-[408px] px-16 h-screen overflow-y-auto mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-white" style={{ textShadow: '4px 4px 4px rgba(0, 0, 0, 0.8)' }}>
        Your Appointment
      </h2>
      {/* <p className="text-center text-1xl text-blue-300 mb-4" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}> {userProfile ? userProfile.user_name : userProfile.email }</p> */}
      <div className="bg-blue-100 shadow-md rounded p-4">
        <p className="font-semibold">Barber: {appointment.barber_name}</p>
        <p>Service: {appointment.service}</p>
        <p>Date: {appointment.date}</p>
        <p>Time: {appointment.time}</p>
      </div>
    </div>
  );
};

export default AppointmentsListUser;
