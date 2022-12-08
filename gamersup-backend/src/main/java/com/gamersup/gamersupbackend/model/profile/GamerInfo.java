package com.gamersup.gamersupbackend.model.profile;

import lombok.*;
import javax.persistence.*;
import java.util.Date;


/**
 * All information of the gamers including the encrypted password
 */


@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gamersinfo")
public class GamerInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name="email")
    private String email;

    @Column(name="name")
    private String name;

    @Column(name="dob")
    private Date dob;

    @Column(name="avatarurl")
    private String avatarUrl;

    @Column(name="bio")
    private String bio;

    @Column(name="level")
    private Integer level; //0-Newbie, 1-Veteran, 2-Pro Gamer

    @Column(name="likes")
    private Integer likes;

    public GamerInfo(String email, String name) {
        this.email = email;
        this.name = name;
    }

}
