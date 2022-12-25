package com.gamersup.gamersupbackend.model.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordWithCurrentPassRequest {
    long userId;
    String currentPassword;
    String newPassword;
}
