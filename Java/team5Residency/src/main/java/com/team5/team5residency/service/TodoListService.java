package com.team5.team5residency.service;

import org.springframework.stereotype.Service;

@Service
public class TodoListService {
    public String healthCheck () {
        return "Service is up";
    }
}
