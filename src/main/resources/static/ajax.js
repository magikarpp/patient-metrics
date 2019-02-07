// URL variables for AJAX calls
let patientData = "/patient/all";
let patientAvg = "/patient/avg";
let patientMax = "/patient/max";
let patientMed = "/patient/median";
let patientMin = "/patient/min";
let patient = "/patient";

let doctorData = "/doctor/all";
let doctorTop = "/doctor/all/top";

// On DOM Load
document.addEventListener("DOMContentLoaded", pageRefresh);
// Create EventListeners
document.getElementById("patient-update-button").addEventListener("click", createPatient);	
document.getElementById("patient-update-button").addEventListener("click", updatePatient);
document.getElementById("patient-delete-button").addEventListener("click", deletePatient);

// Whenever the page needs to be refreshed do:
function pageRefresh(){
	// 1) Grab patients from database, 2) delete all rows from ptable, 3) then add all patients to table.
	// 1) Grab doctor from database, 2) delete all rows from dtable, 3) then add all doctors to table.
	// Calculate Avg, Max, Med, and Min.
	grabPatients();
	grabDoctors();
	calculateValues();
}

// Calculate Values
function calculateValues(){
	sendAjaxGet(patientAvg, displayAvg);
	sendAjaxGet(patientMax, displayMax);
	sendAjaxGet(patientMed, displayMed);
	sendAjaxGet(patientMin, displayMin);
}
function displayAvg(xhr){
	let data = xhr.response;
	let avg = document.getElementById("patient-info-avg");
	avg.innerHTML = Math.round(data * 100) / 100;
}
function displayMax(xhr){
	let data = xhr.response;
	let max = document.getElementById("patient-info-max");
	max.innerHTML = data;
}
function displayMed(xhr){
	let data = xhr.response;
	let med = document.getElementById("patient-info-med");
	med.innerHTML = data;
}
function displayMin(xhr){
	let data = xhr.response;
	let min = document.getElementById("patient-info-min");
	min.innerHTML = data;
}

// Get Patient by Info:
// func = function that uses patientInfo;
// patientInfo = whatever patient info we're searching by (ie. id, first name, heartrate, etc.);
function getPatientByX(func, patientInfo){
	sendAjaxGet2(patientData, func, patientInfo);
}

// Get Doctor by Info:
function getDoctorByX(func, docInfo){
	sendAjaxGet2(doctorData, func, docInfo);
}

// 1) Remove all rows from patient table, 2) grab all patients from database and add to table.
function grabPatients(){
	removeTableRows("ptable");
	sendAjaxGet(patientData, displayPatients);
}

// Display all patients from database onto patient table.
function displayPatients(xhr){
    let data = JSON.parse(xhr.response);
    
    for(i = 0; i < data.length; i++){
    	addPatient(data[i].id, data[i].firstName, data[i].lastName, data[i].heartRate, data[i].doctor);
    }
}

// 1) Remove all rows from doctor table, 2) grab all doctors from database and add to table.
function grabDoctors(){
	removeTableRows("dtable");
	sendAjaxGet(doctorData, displayDoctors);
}

// 1 more step to grab top heartRate for all doctors: addDoctorTop()
function displayDoctors(xhr){
	let data = JSON.parse(xhr.response);
	sendAjaxGet2(doctorTop, addDoctorTop, data);
}

// Adds the highest heartRate of each doctor to themselves.
// Use RegEx to parse through JSON response data for highest heartRate.
function addDoctorTop(xhr, allDoc){
	let data = JSON.parse(xhr.response);
	// Find first digit in string and any digits directly following after.
	var myRe = /^[^\d]*(\d+)/;
	
	for(j = 0; j < allDoc.length; j ++){
		for(i = 0; i < Object.size(data); i++){
			var idOfDoc = myRe.exec(Object.entries(data)[i][0])[1];
			
			if(idOfDoc == allDoc[j].id){
				addDoctor(allDoc[j].id, allDoc[j].firstName, allDoc[j].lastName, Object.entries(data)[i][1]);
			}
		}
	}
}

// Add doctor to table.
function addDoctor(id, first, last, high){
	let row = document.createElement("tr");
	let cell0 = document.createElement("td");
    let cell1 = document.createElement("td");
    let cell2 = document.createElement("td");
    let cell3 = document.createElement("td");
    
    row.appendChild(cell0);
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
	
	cell0.innerHTML = id;
	cell1.innerHTML = first;
	cell2.innerHTML = last;
	cell3.innerHTML = high;
	
	document.getElementById("dbody").appendChild(row);
}

// Invoked when patient update button is clicked and user id does not exist.
function createPatient(){
	// getDoctorBy: Id
	getDoctorByX(createNewPatient, document.getElementById("patient-update-doctor").value);
}

// After getDoctorById, add that doctor to our newPatient Object.
// POST newPatient to database.
function createNewPatient(xhr, info){
	let data = JSON.parse(xhr.response);
	let id = document.getElementById("patient-update-id").value;
	let first = document.getElementById("patient-update-first").value;
	let last = document.getElementById("patient-update-last").value;
	let heart = document.getElementById("patient-update-heart").value;
	let doctor;
	for(i = 0; i < data.length; i++){
		if(data[i].id == info){
			doctor = data[i];
		}
	}
	
	let newPatient = {
		"id": id,
		"firstName": first,
		"lastName": last,
		"heartRate": heart,
		"doctor": doctor
	}
	
	// After POST-ing newPatient, add newPatient to the patient table.
	sendAjaxPost(patient, addNewPatient, newPatient);
}

// Grab specific information from newPatient to use as parameters for addPatient function.
function addNewPatient(newPatient){
	let id = newPatient.id;
	let first = newPatient.firstName;
	let last = newPatient.lastName;
	let doctorId = newPatient.doctor.id;
	addPatient(id, first, last, heart, doctorId);
	pageRefresh();
}

// Add patients directly to table.
function addPatient(id, first, last, heart, doctor){
	let row = document.createElement("tr");
	let cell0 = document.createElement("td");
    let cell1 = document.createElement("td");
    let cell2 = document.createElement("td");
    let cell3 = document.createElement("td");
    let cell4 = document.createElement("td");
    
    row.appendChild(cell0);
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
	
	cell0.innerHTML = id;
	cell1.innerHTML = first;
	cell2.innerHTML = last;
	cell3.innerHTML = heart;
	cell4.innerHTML = doctor.id;
	
	document.getElementById("pbody").appendChild(row);
}

// Invoked when patient update button is clicked and user id already exists.
function updatePatient(){
	// getPatientBy: Id
	getPatientByX(updatePatientInfo, document.getElementById("patient-update-id").value);
}

// After getPatientById, create a temporary patient, changePatient, to replace patient.
// Must grab DoctorByDoctor to add doctor to patient.
function updatePatientInfo(xhr, pid){
	let data = JSON.parse(xhr.response);
	let changePatient;
	for(i = 0; i < data.length; i++){
		if(data[i].id == pid){
			changePatient = data[i];
		}
	}
	
	// Only change information that is present, leave the rest of the fields as is.
	if(changePatient == null){
		return;
	}
	if(document.getElementById("patient-update-first") != ""){
		changePatient.firstName = document.getElementById("patient-update-first").value;
	}
	if(document.getElementById("patient-update-last") != ""){
		changePatient.lastName = document.getElementById("patient-update-last").value;
	}
	if(document.getElementById("patient-update-heart") != ""){
		changePatient.heartRate = document.getElementById("patient-update-heart").value;
	}
	getDoctorByX(putPatient, changePatient);
}

// Update updatedPatient with a new doctor, grabbed by doctorId. Then POST updated patient to database.
function putPatient(xhr, uPatient){
	let data = JSON.parse(xhr.response);
	if(document.getElementById("patient-update-doctor").value != ""){
		for(i = 0; i < data.length; i++){
			if(data[i].id == document.getElementById("patient-update-doctor").value){
				uPatient.doctor = data[i];
			}
		}
	}
	sendAjaxPut(patient, pageRefresh, uPatient);
}

// Invoked when deletePatient button is pressed.
// getPatientBy: Id
function deletePatient(){
	getPatientByX(deletePatientInfo, document.getElementById("patient-delete-id").value);
}

// DELETE patientById from database.
function deletePatientInfo(xhr, pid){
	let data = JSON.parse(xhr.response);
	let delPatient;
	for(i = 0; i < data.length; i++){
		if(data[i].id == pid){
			delPatient = data[i];
		}
	}
	sendAjaxDelete(patient, pageRefresh, delPatient);
}

// HELPER FUNCTIONS:
// Object.size: returns size of Object.
// removeTableRows: removes all rows of table.
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function removeTableRows(tableType){
	var table;
	if(tableType == "ptable"){
		table = document.getElementById("pbody");
	} else{
		table = document.getElementById("dbody");
	}
	
	var tableRows = table.getElementsByTagName('tr');

	for (x = tableRows.length - 1; x > 0; x--) {
	   table.removeChild(tableRows[x]);
	}
}

// AJAX GET call, without information.
function sendAjaxGet(url, callback){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            callback(this);
        }
    }
    xhr.send();
}

// AJAX Get call, with information.
function sendAjaxGet2(url, callback, info){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            callback(this, info);
        }
    }
    xhr.send();
}

// AJAX POST call.
function sendAjaxPost(url, callback, data){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            callback(data);
        }
    }
    xhr.setRequestHeader("content-type", "application/json");
    let jsonData = JSON.stringify(data);
 
    xhr.send(jsonData);
}

// AJAX PUT call.
function sendAjaxPut(url, callback, data){
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", url);

    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            callback(this);
        }
    }
    xhr.setRequestHeader("content-type", "application/json");
    let jsonData = JSON.stringify(data);
 
    xhr.send(jsonData);
}

// AJAX DELETE call.
function sendAjaxDelete(url, callback, data){
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);

    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            callback(this);
        }
    }
    xhr.setRequestHeader("content-type", "application/json");
    let jsonData = JSON.stringify(data);
 
    xhr.send(jsonData);
}