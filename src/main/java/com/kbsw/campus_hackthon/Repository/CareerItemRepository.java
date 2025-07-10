package com.kbsw.campus_hackthon.Repository;

import com.kbsw.campus_hackthon.entity.CareerItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface CareerItemRepository extends JpaRepository<CareerItem, Long> {
    @Query("SELECT DISTINCT c FROM CareerItem c JOIN FETCH c.definedTags dt")
    List<CareerItem> findAllWithDefinedTags();
}