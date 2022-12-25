package com.gamersup.gamersupbackend.model.profile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GamerSettingsRequest {
    long userId;
    String avatarUrl;
    Integer level;
    Date dob;
    String bio;
}
