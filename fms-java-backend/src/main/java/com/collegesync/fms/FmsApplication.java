package com.collegesync.fms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(FmsApplication.class, args);
        System.out.println("============================================================");
        System.out.println("  CollegeSync Fee Management System (FMS) Backend Started! ");
        System.out.println("  Access Web Application at: http://localhost:8080/          ");
        System.out.println("============================================================");
    }
}
