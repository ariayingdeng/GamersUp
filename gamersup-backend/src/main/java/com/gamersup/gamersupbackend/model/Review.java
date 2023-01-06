package com.gamersup.gamersupbackend.model;

import com.vladmihalcea.hibernate.type.array.ListArrayType;
import com.vladmihalcea.hibernate.type.json.JsonStringType;
import lombok.*;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reviews")
@TypeDef(name = "json", typeClass = JsonStringType.class)
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    @Column(name = "userid")
    private long userID;

    @Column(name = "gameid")
    private long gameID;

    @Column(name = "rating")
    private int rating; //rating: 1-5 for a normal review, 0 for a hate game, 6 for a love game

    @Column(name = "comment")
    private String comment;

    @Column(name = "stars")
    private int stars = 0;

    @Type(type = "json")
    @Column(name = "starredby", columnDefinition = "json")
    private List<Long> starredBy = new ArrayList<>();

}
