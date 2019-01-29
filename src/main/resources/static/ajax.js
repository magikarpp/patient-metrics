let patientData = "/patient/all";
let patientAvg = "/patient/avg";
let patientMax = "/patient/max";
let patientMed = "/patient/median";
let patientMin = "/patient/min";
let patient = "/patient/";


let doctorData = "/doctor/all";
let doctorTop = "/doctor/all/top";

window.onload = function(){
	  runOnRefresh();
	  highDoctors(); //delete this once displayDoctors is finished
	  document.getElementById("patient-update-button").addEventListener("click", createPatient);
}

function runOnRefresh(){
	  grabPatients();
	  grabDoctors();
	  calculateValues();
}

function createPatient(){
//	console.log(document.getElementById("patient-update-id").value);
//	sendAjaxPost(patient, addNewPatient);
}

//PROBLEM WIth ASYNC: GRABBING RETURN VALUE BEFORE THE UPDATE HAPPENS
async function highDoctors(){
	let data = sendAjaxGet(doctorTop, getHigh);
	
	//console.log(data);
	return data;
}

function getHigh(xhr){
	let data = JSON.parse(xhr.response);
	//console.log(JSON.parse(xhr.response));
	return data;
	
}

function grabDoctors(){
	sendAjaxGet(doctorData, displayDoctors);
}

function displayDoctors(xhr){
	let data = JSON.parse(xhr.response);
	for(i = 0; i < data.length; i++){
    	addDoctor(data[i].id, data[i].firstName, data[i].lastName, "testing"); //replace "testing" with highDoctors(i)
    }
}

function addDoctor(id, first, last, high){
	var table = document.getElementsByClassName("table")[1];
	var row = table.insertRow(1);
	
	var cell0 = row.insertCell(0);
	var cell1 = row.insertCell(1);
	var cell2 = row.insertCell(2);
	var cell3 = row.insertCell(3);
	
	cell0.innerHTML = id;
	cell1.innerHTML = first;
	cell2.innerHTML = last;
	cell3.innerHTML = high;
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
	sendAjaxGet(patientData, displayPatients);
}

function displayPatients(xhr){
    let data = JSON.parse(xhr.response);
    
    for(i = 0; i < data.length; i++){
    	addPatient(data[i].id, data[i].firstName, data[i].lastName, data[i].heartRate, data[i].doctor.id);
    }
}

function addPatient(id, first, last, heart, doctor){
	var table = document.getElementsByClassName("table")[0];
	var row = table.insertRow(1);
	
	var cell0 = row.insertCell(0);
	var cell1 = row.insertCell(1);
	var cell2 = row.insertCell(2);
	var cell3 = row.insertCell(3);
	var cell4 = row.insertCell(4);
	
	cell0.innerHTML = id;
	cell1.innerHTML = first;
	cell2.innerHTML = last;
	cell3.innerHTML = heart;
	cell4.innerHTML = doctor;
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

function sendAjaxPost(url, callback, data){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            callback(this);
        }
    }
    xhr.setRequestHeader("content-type", "application/json");
    let jsonData = JSON.stringify(data);
 
    xhr.send(jsonData);
}