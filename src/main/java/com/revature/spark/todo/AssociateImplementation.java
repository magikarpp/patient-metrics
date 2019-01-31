package com.revature.spark.todo;

import java.util.HashMap; //only used for the bonus question
import java.util.List;
import java.util.Map;

import com.revature.spark.beans.Doctor;
import com.revature.spark.beans.Patient;

/**
 * Within this class, you will implement the logic to calculate data for various
 * reports.
 * 
 * @author J Shim
 * 
 */
public class AssociateImplementation {

	/**
	 * Find the sum of all heart rates.
	 * 
	 * @param calls
	 * @return
	 */
	public Double sum(List<Patient> patients) {
		double total = 0;
		for(int i = 0; i < patients.size(); i++) {
			total += patients.get(i).getHeartRate();
		}
		return total;
	}

	/**
	 * Find the lowest heart rate.
	 * 
	 * @param calls
	 * @return
	 */
	public Double min(List<Patient> patients) {
		double result = 99999; //assuming a patient's heartrate does not go over 99999
		for(int i = 0; i < patients.size(); i++) {
			result = Math.min(result, patients.get(i).getHeartRate());
		}
		return result;
	}

	/**
	 * Find the highest heart rate.
	 * 
	 * @param calls
	 * @return
	 */
	public Double max(List<Patient> patients) {
		double result = 0; //assuming a patient's heartrate does not go under 0;
		for(int i = 0; i < patients.size(); i++) {
			result = Math.max(result, patients.get(i).getHeartRate());
		}
		return result;
	}

	/**
	 * Find the average heart rate.
	 * 
	 * @param calls
	 * @return
	 */
	public Double avg(List<Patient> patients) {
		double result = 0;
		for(int i = 0; i < patients.size(); i++) {
			result += patients.get(i).getHeartRate();
		}
		result = result/patients.size();
		return result;
	}

	/**
	 * Find the median heart rate.
	 * 
	 * @param calls
	 * @return
	 */
	
	public Double median(List<Patient> patients) {
		double arrayList[] = new double[patients.size()];
		double result;
		for(int i = 0; i < patients.size(); i++) {
			arrayList[i] = patients.get(i).getHeartRate();
		}
		
		bubbleSort(arrayList);
		reverse(arrayList);

		if(patients.size()%2 == 0) {
			result = (arrayList[(int) Math.floor(patients.size()/2 - 1)] + arrayList[(int) Math.ceil(patients.size()/2)])/2;
		}else {
			result = arrayList[patients.size()/2];
		}
		
		return result;
	}
	
	public void bubbleSort(double[] array) {
	    boolean swapped = true;
	    int j = 0;
	    double tmp;
	    while (swapped) {
	        swapped = false;
	        j++;
	        for (int i = 0; i < array.length - j; i++) {
	            if (array[i] > array[i + 1]) {
	                tmp = array[i];
	                array[i] = array[i + 1];
	                array[i + 1] = tmp;
	                swapped = true;
	            }
	        }
	    }
	}
	
	public void reverse(double[] array) {
		for(int i = 0; i < array.length / 2; i++)
		{
		    double temp = array[i];
		    array[i] = array[array.length - i - 1];
		    array[array.length - i - 1] = temp;
		}
	}
	
	/**
	 * !! BONUS CHALLENGE REQUIREMENT !!
	 * 
	 * Find the highest heart rate per doctor
	 * 
	 * @param calls
	 * @return
	 */
	//Cheated on this one by using HashMap library...
	public Map<Doctor, Double> highestPatientHeartRatePerDoctor(List<Patient> patients) {
		Map<Doctor, Double> docMap = new HashMap<Doctor, Double>();
		
		for(int i = 0; i < patients.size(); i++) {
			if(docMap.get(patients.get(i).getDoctor()) == null) {
				docMap.put(patients.get(i).getDoctor(), patients.get(i).getHeartRate());
			}
			if(docMap.get(patients.get(i).getDoctor()) < patients.get(i).getHeartRate()) {
				docMap.put(patients.get(i).getDoctor(), patients.get(i).getHeartRate());
			}
		}
		
		return docMap;
	}

}
