package com.team5.team5residency.repository;

import com.team5.team5residency.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Integer> {

    List<TaskEntity> findByUsername(String userName);

    Optional<TaskEntity> findByIdAndUsername(int id, String userId);
}
