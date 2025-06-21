const reservationModule = {
    createReservation: async (dbHelper, session, data) => {
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on booking reservation'
        };

        try {
            const { guestName, homeAddress, officeAddress, category, telephone,
                 officeTelephone, numberOfGuests, numberOfAdults, numberOfPwds, 
                 numberOfChildren, emergencyContact, dateOfArrival, dateOfDeparture, 
                 facilityType, letterOfIntentFile, agreedToTerms } = data;

            if (
                !isPresent(guestName) ||
                !isPresent(homeAddress) ||
                !isPresent(officeAddress) ||
                !isPresent(category) ||
                !isPresent(telephone) ||
                !isPresent(officeTelephone) ||
                !isPresent(numberOfGuests) ||
                !isPresent(emergencyContact) ||
                !isPresent(dateOfArrival) ||
                !isPresent(dateOfDeparture) ||
                !isPresent(facilityType) ||
                !isPresent(letterOfIntentFile) ||
                !agreedToTerms
            ) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Missing required fields';
                return responseData;
            }

            if (!userId) {
                responseData.status = Status.UNAUTHORIZED;
                responseData.error = 'User not logged in';
                return responseData;
              }

            if (!isValidCategory(category)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid category';
                return responseData;
            }

            if (!isValidDate(dateOfArrival) || !isValidDate(dateOfDeparture)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid date format';
                return responseData;
            }

            if (!isValidDateRange(dateOfArrival, dateOfDeparture)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid date range: ensure arrival is today or later, and departure is after arrival';
                return responseData;
            }

            if (!isValidFacilityType(facilityType)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid facility type';
                return responseData;
            }
            
            const adults = parseInt(numberOfAdults) || 0;
            const children = parseInt(numberOfChildren) || 0;
            const pwds = parseInt(numberOfPwds) || 0;

            const computedTotal = adults + children + pwds;
            const manualTotal = parseInt(numberOfGuests) || 0;

            if (manualTotal !== computedTotal) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'The total number of guests does not match the breakdown of guests';
                return responseData;
            }

            if (computedTotal <= 0) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'At least one guest is required';
                return responseData;
            }

            try {
                const userCreated = await dbHelper.create('user', { 
                    email, 
                    name, 
                    password: await hashPassword(password), 
                    mobileNumber: convertToPlus639Format(mobileNumber),
                    createdAt: new Date().valueOf(),
                    lastLoggedIn: null
                });                

                responseData.status = Status.OK;
                responseData.error = null;
                responseData.message = 'User registered successfully';
                responseData.userId = userCreated._id.toString();
            } catch (error) {
                console.error('Error registering user:', error);
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
        return responseData;
    }
};

export default reservationModule;

function isValidCategory(category) {
    const validCategories = [Category.DEPED, Category.GOVERNMENT, Category.OTHERS];
    return validCategories.includes(category);
}

function isValidDate(dateStr) {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(dateStr)) return false;

    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}


function isValidDateRange(dateOfArrival, dateOfDeparture) {
    if (!isValidDate(dateOfArrival) || !isValidDate(dateOfDeparture)) return false;

    const arrival = new Date(dateOfArrival);
    const departure = new Date(dateOfDeparture);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const twoWeeksFromToday = new Date(today);
    twoWeeksFromToday.setDate(today.getDate() + 14); 

    if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) return false;
    if (arrival < twoWeeksFromToday) return false;
    if (departure <= arrival) return false;

    return true;
}

function isValidFacilityType(facilityType) {
    const validFacilityTypes = [FacilityType.DEPED, FacilityType.GOVERNMENT, FacilityType.OTHERS];
    return validFacilityTypes.includes(facilityType);
}

function isPresent(value) {
    return value !== null && value !== undefined && value.trim().length > 0;
}