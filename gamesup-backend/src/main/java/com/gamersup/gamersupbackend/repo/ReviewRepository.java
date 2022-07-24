package com.gamersup.gamersupbackend.repo;

import com.gamersup.gamersupbackend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByUserIDAndGameID(long userID, long gameID);
    List<Review> findAllByUserID(long userID);

    List<Review> findAllByGameID(long gameID);
}
