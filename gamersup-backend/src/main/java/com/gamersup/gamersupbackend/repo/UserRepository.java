package com.gamersup.gamersupbackend.repo;

import com.gamersup.gamersupbackend.model.account.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE User a " + "SET a.enable = TRUE WHERE a.email = ?1")
    int enableUser(String email);
}
