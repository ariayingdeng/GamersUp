package com.gamersup.gamersupbackend.model.profile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AvatarChangeRequest {
    long userId;
    String url;
}
