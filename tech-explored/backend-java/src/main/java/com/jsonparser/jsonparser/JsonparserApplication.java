package com.jsonparser.jsonparser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
//@ComponentScan(basePackages = "com.jsonparser.jsonparser")
public class JsonparserApplication {
	public static void main(String[] args) {
		SpringApplication.run(JsonparserApplication.class, args);
	}
}
