package com.gamersup.gamersupbackend.model.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GoogleLoginRequest {
    private String email;
    private String name;
    private String avatarUrl;
}
