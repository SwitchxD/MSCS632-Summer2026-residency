package com.team5.team5residency;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Team5ResidencyApplication {

    private static final Log log = LogFactory.getLog(Team5ResidencyApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(Team5ResidencyApplication.class, args);
    }

}
