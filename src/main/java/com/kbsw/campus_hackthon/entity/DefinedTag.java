package com.kbsw.campus_hackthon.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "defined_tag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DefinedTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag_name", unique = true, nullable = false)
    private String tagName;

    @ManyToMany(mappedBy = "definedTags")
    @JsonIgnore
    @Builder.Default
    private List<com.kbsw.campus_hackthon.entity.CareerItem> careerItems = new ArrayList<>();
}