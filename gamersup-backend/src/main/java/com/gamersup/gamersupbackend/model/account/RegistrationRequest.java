package com.gamersup.gamersupbackend.model.account;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * For register request body
 */


@Getter
@Setter
@EqualsAndHashCode
@ToString
public class RegistrationRequest {
    private String name;
    private String email;
    private String password;
}
