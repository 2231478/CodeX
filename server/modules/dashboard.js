import { Status, UserRole } from '../constants.js';

const dashboardModule = {
    /**
     * Retrieves the count of reservations for the current day.
     * @param {object} user - The user object containing userId and userRole.
     * @returns {object} Response data with status, error, message, and count on success.
     */
    getTodaysReservationCount: async (dbHelper, user) => {
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error fetching today\'s reservation count'
        };
        try {
            if (!user || !user.userId) {
                responseData.status = Status.UNAUTHORIZED;
                responseData.error = 'User not logged in.';
                return responseData;
            }

            if (user.userRole === UserRole.GUEST) {
                responseData.status = Status.FORBIDDEN;
                responseData.error = 'You are not authorized to perform this action.';
                return responseData;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1); 

            const reservations = await dbHelper.find('reservation', {
                dateOfArrival: {
                    $gte: today,
                    $lt: tomorrow
                }
            });

            responseData.status = Status.OK;
            responseData.error = null;
            responseData.message = 'Successfully fetched today\'s reservation count';
            responseData.count = reservations.length;
        } catch (error) {
            console.error('Error fetching today\'s reservation count:', error);
            responseData.error = error.message;
        }
        return responseData;
    },

    getMonthlyCheckInsCount: async (dbHelper, user) => {
    const responseData = {
        status: Status.INTERNAL_SERVER_ERROR,
        error: 'Error fetching monthly check-ins count'
    };

    try {
        if (!user || !user.userId) {
        responseData.status = Status.UNAUTHORIZED;
        responseData.error = 'Unauthorized: User not logged in.';
        return responseData;
        }

        if (user.userRole === UserRole.GUEST) {
        responseData.status = Status.FORBIDDEN;
        responseData.error = 'You are not authorized to perform this action.';
        return responseData;
        }

        const today = new Date();
        const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

        const checkIns = await dbHelper.find('reservation', {
        dateOfArrival: {
            $gte: firstDayOfCurrentMonth,
            $lt: firstDayOfNextMonth
        }
        }, { _id: 1 }); 

        responseData.status = Status.OK;
        responseData.error = null;
        responseData.message = 'Successfully fetched monthly check-ins count';
        responseData.count = checkIns.length;
    } catch (error) {
        console.error('Error fetching monthly check-ins count:', error);
        responseData.error = error.message;
    }
    return responseData;
    }
};

export default dashboardModule;