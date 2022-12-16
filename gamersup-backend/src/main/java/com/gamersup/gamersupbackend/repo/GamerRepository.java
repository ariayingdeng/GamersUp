package com.gamersup.gamersupbackend.repo;

import com.gamersup.gamersupbackend.model.profile.GamerInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GamerRepository extends JpaRepository<GamerInfo, Long> {
    Optional<GamerInfo> findByEmail(String email);

    void deleteByEmail(String email);

//    @Transactional
//    @Modifying
//    @Query("UPDATE GamerInfo a " + "SET a.enable = TRUE WHERE a.email = ?1")
//    int enableGamer(String email);

//    Optional<GamerInfo> findGamerById(long id);

}
