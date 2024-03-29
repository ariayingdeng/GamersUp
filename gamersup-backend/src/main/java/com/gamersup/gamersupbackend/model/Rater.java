package com.gamersup.gamersupbackend.model;

import com.gamersup.gamersupbackend.service.ReviewService;

import java.util.ArrayList;
import java.util.HashMap;

public class Rater {

    private ReviewService reviewService;

    private long userID;
    HashMap<Long, Rating> ratings; // to store all ratings from the user

    public Rater(long userID) {
        this.userID = userID;
        ratings = new HashMap<>();
    }

    public long getUserID() {
        return userID;
    }

    public void setUserID(long userID) {
        this.userID = userID;
    }

    public HashMap<Long, Rating> getRatings() {
        return ratings;
    }

    public void setRatings(HashMap<Long, Rating> ratings) {
        this.ratings = ratings;
    }

    public void addRating(long gameID, int rating) {
        ratings.put(gameID, new Rating(gameID, rating));
    }

    public boolean hasRating(long gameID) {
        return ratings.containsKey(gameID);
    }

    public double getRating(long gameID) {
        Rating rating = ratings.get(gameID);
        if (rating != null) {
            return rating.getValue();
        }
        return -1;
    }

    /**
     *
     * @return the number of ratings of a rater
     */
    public int numRatings() {
        return ratings.size();
    }

    /**
     *
     * @return the list of the IDs of games that a rater rated
     */
    public ArrayList<Long> getGamesRated() {
        ArrayList<Long> gamesList = new ArrayList<>();
        for (Long key: ratings.keySet()) {
            gamesList.add(key);
        }
        return gamesList;
    }


}
