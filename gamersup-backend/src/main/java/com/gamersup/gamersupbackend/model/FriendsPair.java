package com.gamersup.gamersupbackend.model;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class FriendsPair implements Serializable {
    private long gamerAId;
    private long gamerBId;

}
