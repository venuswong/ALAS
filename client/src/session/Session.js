// returns a promise containing a boolean of whether the user is logged in
export function isUserLoggedIn() {
    return fetch("/api/user/logged-in", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

// returns a promise containing the user's first name
export function getUserFirstName() {
    return fetch("/api/user/fname", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

// returns a promise containing the user's last name
export function getUserLastName() {
    return fetch("/api/user/lname", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

// returns a promise containing the user's account type
export function getUserAccountType() {
    return fetch("/api/user/account-type", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

// returns a promise containing the user's list of actions as defined in the actions table
export function getUserActions() {
    return fetch("/api/user/getActions", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

export function getMaterials() {
    return fetch("/api/user/getMaterials", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

// returns promise containing patient info for all user's patients
export function getUserPatients() {
    return fetch("/api/user/getPatientInfo", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

export function getSchoolDistrict(SDIid) {
    return fetch("api/user/getSchoolDistrict/" + SDIid.toString(), {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

// updates database with new value for Action
export function updateAction(action) {
    return fetch("/api/user/updateAction", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // Serialize JSON body
        body: JSON.stringify(action)
    });
}

// returns a promise containing the user's profile information
export function getProfile() {
    return fetch("/api/user/profile", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

export function getChildrenInfo() {
    return fetch("/api/user/children", {
              method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

export function getChildrenInsurance() {
    return fetch("/api/user/childreninsurance", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

export function postChildInsurance(information, insurance) {
    return fetch("/api/user/updatechildinsurance", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // Serialize JSON body
        body: JSON.stringify({information, insurance})
    });
}

export function postChildSchool(information, school) {
    return fetch("/api/user/updatechildschool", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // Serialize JSON body
        body: JSON.stringify({information, school})
    });
}

export function getChildrenSchool() {
    return fetch("/api/user/childrenschool", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

export function getBasicChildInfoByPIid(PIid) {
    return fetch("/api/patient/" + PIid.toString(), {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

/* ------------------ Used by ClinicianView ---------------------- */
// Get all patients, only usable by admin and clinician
export function getPatients() {
    return fetch("/api/clinician/getPatients", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

// Get all actions for a patient by PIid
export function getActionsByPIid(PIid) {
    return fetch("/api/clinician/" + PIid + "/getActions", {
        method: "get",
        header: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

// get parent's email association with child with PIid
export function getParentEmailByPIid(PIid) {
    return fetch("/api/clinician/" + PIid + "/getEmail", {
        method: "get",
        header: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

/* ------------------ Used by AnswerView ---------------------- */

export function postQuestionReponse(QuestionID, Answer, IsFAQ) {
    return fetch("/api/clinician/updateQuestion", {
        method: "post",
            headers: {
            'Accept': 'application/json',
                'Content-Type': 'application/json'
        },
        // Serialize JSON body
        body: JSON.stringify({QuestionID, Answer, IsFAQ})
    });
}


/* ------------------------------------------------------------ */

// returns a promise for a GET that logs the user out, returning a success code
export function logout() {
    return fetch("/api/login/logout", {
        method: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}
