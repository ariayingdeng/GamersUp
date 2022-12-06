package com.gamersup.gamersupbackend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

/**
 * The profile which other users are visible
 *
 */

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GamerProfile {
    private long userID;
    private String userName;
    private String email;
    private Date dob;
    private String avatarUrl;
    private String bio;
    private Integer level;;
    private Integer likes;

}
