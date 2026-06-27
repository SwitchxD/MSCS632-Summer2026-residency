package com.team5.team5residency.controller;

import com.team5.team5residency.service.TodoListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api")
@Log4j2
public class TodoListController {

    @Autowired
    TodoListService todoListService;

    @GetMapping(path = "/healthCheck")
    public String test (){
        String response = todoListService.healthCheck();
        log.info("Test controller run success");
        return response;
    }
}
