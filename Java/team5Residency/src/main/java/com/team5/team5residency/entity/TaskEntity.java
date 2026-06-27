package com.team5.team5residency.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "TASKS")
@Getter
@Setter
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String taskName;

    @Column
    private String category;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String status; // PENDING or COMPLETED

}
