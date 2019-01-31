//If anyone is referencing my work. Please don't... it's so unorganized and embarrassing....

let patientData = "/patient/all";
let patientAvg = "/patient/avg";
let patientMax = "/patient/max";
let patientMed = "/patient/median";
let patientMin = "/patient/min";
let patient = "/patient";

let doctorData = "/doctor/all";
let doctorTop = "/doctor/all/top";

document.addEventListener("DOMContentLoaded", pageRefresh);
document.getElementById("refresh-button").addEventListener("click", pageRefresh);
document.getElementById("patient-update-button").addEventListener("click", createPatient);	
document.getElementById("patient-update-button").addEventListener("click", updatePatient);
document.getElementById("patient-delete-button").addEventListener("click", deletePatient);

function pageRefresh(){
	grabPatients();
	grabDoctors();
	calculateValues();
}

function deletePatient(){
	getPatientById(deletePatientInfo, document.getElementById("patient-delete-id").value);
}

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

function updatePatient(){
	getPatientById(updatePatientInfo, document.getElementById("patient-update-id").value);
}

function getPatientById(func, pid){
	sendAjaxGet2(patientData, func, pid);
}

function updatePatientInfo(xhr, pid){
	let data = JSON.parse(xhr.response);
	let changePatient;
	for(i = 0; i < data.length; i++){
		if(data[i].id == pid){
			changePatient = data[i];
		}
	}
	if(changePatient == null){
		return
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
	getDoctorById(putPatient, changePatient);
}

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

function doNothing(xhr){
	console.log("Nothing Happened!");
}

// ?? DOES NOT ASSIGN TABLE ON FIRST RUN THROUGH: either manually refresh page or press refresh button at top.
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

function createPatient(){
	getDoctorById(createNewPatient, document.getElementById("patient-update-doctor").value);
}

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
	
	sendAjaxPost(patient, addNewPatient, newPatient);
}

function addNewPatient(newPatient){
	let id = newPatient.id;
	let first = newPatient.firstName;
	let last = newPatient.lastName;
	let doctorId = newPatient.doctor.id;
	addPatient(id, first, last, heart, doctorId);
	pageRefresh();
}

function getDoctorById(func, docId){
	sendAjaxGet2(doctorData, func, docId);
}

function grabDoctors(){
	removeTableRows("dtable");
	sendAjaxGet(doctorData, displayDoctors);
}

function displayDoctors(xhr){
	let data = JSON.parse(xhr.response);
	sendAjaxGet2(doctorTop, addDoctorTop, data);
}

function addDoctorTop(xhr, allDoc){
	let data = JSON.parse(xhr.response);
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

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

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

function calculateValues(){
	sendAjaxGet(patientAvg, displayAvg);
	sendAjaxGet(patientMax, displayMax);
	sendAjaxGet(patientMed, displayMed);
	sendAjaxGet(patientMin, displayMin);
}

function displayAvg(xhr){
	let data = xhr.response;
	let avg = document.getElementById("patient-info-avg");
	avg.innerHTML = data;
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

function grabPatients(){
	removeTableRows("ptable");
	sendAjaxGet(patientData, displayPatients);
}

function displayPatients(xhr){
    let data = JSON.parse(xhr.response);
    
    for(i = 0; i < data.length; i++){
    	addPatient(data[i].id, data[i].firstName, data[i].lastName, data[i].heartRate, data[i].doctor);
    }
}

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

function sendAjaxPost(url, callback, data){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            callback(data);
        }else {
        	console.log(xhr.response);
        }
    }
    xhr.setRequestHeader("content-type", "application/json");
    let jsonData = JSON.stringify(data);
 
    xhr.send(jsonData);
}

function sendAjaxPut(url, callback, data){
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", url);

    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            callback(this);
        }else {
        	console.log(xhr.response);
        }
    }
    xhr.setRequestHeader("content-type", "application/json");
    let jsonData = JSON.stringify(data);
 
    xhr.send(jsonData);
}

function sendAjaxDelete(url, callback, data){
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);

    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            callback(this);
        }else {
        	console.log(xhr.response);
        }
    }
    xhr.setRequestHeader("content-type", "application/json");
    let jsonData = JSON.stringify(data);
 
    xhr.send(jsonData);
}