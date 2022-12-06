package com.gamersup.gamersupbackend.service.email_service.token;

import com.gamersup.gamersupbackend.model.account.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class ConfirmationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private LocalDateTime creatAt;

    private LocalDateTime confirmedAt;

    @Column(nullable = false)
    private LocalDateTime expiredAt;

    @ManyToOne
    @JoinColumn(
            nullable = false,
            name = "user_id"
    )
    private User user;

    public ConfirmationToken(String token, LocalDateTime creatAt, LocalDateTime expiredAt, User user) {
        this.token = token;
        this.creatAt = creatAt;
        this.expiredAt = expiredAt;
        this.user = user;
    }
}
