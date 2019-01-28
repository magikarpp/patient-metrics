package com.revature.spark;

import static org.junit.Assert.assertEquals;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.junit.BeforeClass;
import org.junit.Test;

import com.revature.spark.beans.Doctor;
import com.revature.spark.beans.Patient;
import com.revature.spark.todo.AssociateImplementation;

public class PatientMetricsApplicationTests {

	static AssociateImplementation service = new AssociateImplementation();
	static double precision = 0.01;
	static List<Patient> patients;
	static List<Patient> oddPatients;
	static Doctor dan;
	static Doctor randolph;
	static Doctor howard;

	@BeforeClass
	public static void before() {
		dan = new Doctor(1, "Dan", "Pickles");
		randolph = new Doctor(2, "Randolph", "Scott");
		howard = new Doctor(3, "Howard", "Johnson");

		// even calls
		patients = new LinkedList<>();
		patients.add(new Patient(1, "a", "A", 1.50, dan));
		patients.add(new Patient(2, "b", "B", 2.50, dan));
		patients.add(new Patient(3, "c", "C", 3.10, dan));
		patients.add(new Patient(4, "d", "D", 4.50, dan));
		patients.add(new Patient(5, "e", "A", 4.10, randolph));
		patients.add(new Patient(6, "f", "B", 2.15, randolph));
		patients.add(new Patient(7, "g", "C", 3.25, randolph));
		patients.add(new Patient(8, "h", "D", 10.50, howard));
		patients.add(new Patient(9, "i", "A", 11.20, howard));
		patients.add(new Patient(10, "j", "B", 15.50, howard));

		// odd calls
		oddPatients = new LinkedList<>();
		oddPatients.add(new Patient(1, "a", "A", 1.50, dan));
		oddPatients.add(new Patient(2, "b", "B", 2.50, dan));
		oddPatients.add(new Patient(3, "c", "C", 3.10, dan));
		oddPatients.add(new Patient(6, "f", "B", 2.15, randolph));
		oddPatients.add(new Patient(7, "g", "C", 3.25, randolph));
		oddPatients.add(new Patient(8, "h", "D", 10.50, howard));
		oddPatients.add(new Patient(10, "j", "B", 15.50, howard));

	}

	@Test
	public void sumTest() {
		double sum = 58.3;
		double testSum = service.sum(patients);
		assertEquals(sum, testSum, precision);
	}

	@Test
	public void minTest() {
		double min = 1.5;
		double testMin = service.min(patients);
		assertEquals(min, testMin, precision);
	}

	@Test
	public void maxTest() {
		double max = 15.5;
		double testMax = service.max(patients);
		assertEquals(max, testMax, precision);
	}

	@Test
	public void avgTest() {
		double avg = 5.83;
		double testAvg = service.avg(patients);
		assertEquals(avg, testAvg, precision);
	}

	@Test
	public void medianTest() {
		// check even length
		double median = 3.675;	
		double testMedian = service.median(patients);
		assertEquals(median, testMedian, precision);

		// check odd length
		median = 3.1;
		testMedian = service.median(oddPatients);
		assertEquals(median, testMedian, precision);
	}

	@Test
	public void highestPatientCategoryPerDoctor() {
		// test highest
		Map<Doctor, Double> testTotal = service.highestPatientHeartRatePerDoctor(patients);
		assertEquals(4.5, testTotal.get(new Doctor(1, "Dan", "Pickles")).doubleValue(), precision);
		assertEquals(4.1, testTotal.get(new Doctor(2, "Randolph", "Scott")).doubleValue(), precision);
		assertEquals(15.5, testTotal.get(new Doctor(3, "Howard", "Johnson")).doubleValue(), precision);
	}

}
