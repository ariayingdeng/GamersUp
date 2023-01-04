package com.gamersup.gamersupbackend.api;

import com.gamersup.gamersupbackend.model.Friends;
import com.gamersup.gamersupbackend.model.FriendsPair;
import com.gamersup.gamersupbackend.model.profile.*;
import com.gamersup.gamersupbackend.service.GamerService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/gamerinfo")
@AllArgsConstructor
@CrossOrigin(origins="http://localhost:5252")
public class GamersApi {

    private GamerService service;

    // build create gamer REST API
    // for creating admin account
//    @PostMapping("/create")
////    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
//    public ResponseEntity<GamerInfo> saveGamer(@RequestBody GamerInfo gamer) {
//        return new ResponseEntity<GamerInfo>(service.saveGamer(gamer), HttpStatus.CREATED);
//    }

    // build get all gamer REST API
    @GetMapping("/all")
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public List<GamerInfo> getAllGamers() {
        return service.getAllGamers();
    }

    // build get gamer by id REST API
    @GetMapping("/gamer={gamerid}")
    public GamerInfo getGamerInfoById(@PathVariable long gamerid) {
        return service.getGamerInfoById(gamerid);
    }

    // Get gamer by email
    @GetMapping("/email={email}")
    public GamerInfo getGamerInfoByEmail(@PathVariable String email) {
        return service.getGamerInfoByEmail(email);
    }

    // TODO: Search Gamers by username (wild-card)
    @GetMapping("/search?{keyword}")
    public ResponseEntity<List<GamerInfo>> searchGamersByKeyword(@PathVariable("keyword") String keyword) {return null;}

    // build delete gamer REST API
    @DeleteMapping("/delete/{email}")
    public ResponseEntity<String> deleteGamer(@PathVariable("email") String email) {
        // delete gamer from db
        service.deleteGamer(email);
        return new ResponseEntity<>("Gamer deleted successfully!", HttpStatus.OK);
    }


    @PostMapping("/friendsAdd/{idA}&{idB}")
    public ResponseEntity<String> addFriend(@PathVariable("idA") long idA, @PathVariable("idB") long idB) {
        if (service.acceptFriendRequest(idA, idB)) {
            return new ResponseEntity<>("Created!", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed", HttpStatus.EXPECTATION_FAILED);
        }
    }

    // For accepting friend request with UI
    @PostMapping("/accept/friend")
    public ResponseEntity<Boolean> acceptFriendRequest(@RequestBody Friends friends) {
        if (service.acceptFriendRequest(friends.getGamerAId(), friends.getGamerBId())) {
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(false, HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PostMapping("/addfriendrequest/{idA}&{idB}")
    public ResponseEntity<Boolean> requestFriend(@PathVariable("idA") long idA, @PathVariable("idB") long idB) {
        return new ResponseEntity<>(service.createFriendRequest(idA, idB), HttpStatus.OK);
    }

    @GetMapping("/friends/{id}")
    public ResponseEntity<List<GamerInfo>> getFriendsListById(@PathVariable("id") long id) {
        List<Long> friendIdList = service.getFriendListById(id);
        List<GamerInfo> friends = new ArrayList<>();
        for (long friendId : friendIdList) {
            friends.add(service.getGamerInfoById(friendId));
        }
        return new ResponseEntity<>(friends, HttpStatus.OK);
    }

    // get the bio from gamer
    @GetMapping("/bio/gamer={gamerid}")
    public ResponseEntity<String> getBioByGamer(@PathVariable("gamerid") long id) {
        return new ResponseEntity<>(service.getBioById(id), HttpStatus.OK);
    }

    // Update the settings of gamer info
    @PutMapping("/update/settings")
    public ResponseEntity<GamerInfo> updateGamerInfo(@RequestBody GamerSettingsRequest settingsRequest) {
        GamerInfo updatedGamer = service.updateGamerInfo(settingsRequest);
        return new ResponseEntity<>(updatedGamer, HttpStatus.OK);
    }

    // change bio
    @PutMapping("/bio/changebio")
    public ResponseEntity<Boolean> changeBioByGamerId(@RequestBody BioChangeRequest bioChangeRequest) {
        return new ResponseEntity<>(service.changeBioById(bioChangeRequest.getUserId(), bioChangeRequest.getBio()), HttpStatus.OK);
    }

    // change avatar
    @PutMapping("/changeAvatar")
    public ResponseEntity<Boolean> changeAvatarByGamerId(@RequestBody AvatarChangeRequest avatarChangeRequest) {
        return new ResponseEntity<>(service.changeAvatarById(avatarChangeRequest.getUserId(), avatarChangeRequest.getUrl()), HttpStatus.OK);
    }

    // change birthday
    @PutMapping("/changeBirthday")
    public ResponseEntity<Boolean> changeBirthdayByGamerId(@RequestBody BirthdayRequest birthdayRequest) {
        return new ResponseEntity<>(service.changeBirthdayById(birthdayRequest.getUserId(), birthdayRequest.getDob()), HttpStatus.OK);
    }

    // change level
    @PutMapping("/changeLevel")
    public ResponseEntity<Boolean> changeLevelByGamerId(@RequestBody LevelRequest levelRequest) {
        return new ResponseEntity<>(service.changeLevel(levelRequest.getUserId(), levelRequest.getLevel()), HttpStatus.OK);
    }

    // change likes
    @PutMapping("/changeLikes/{id}")
    public ResponseEntity<Boolean> changeLikesByGamerId(@PathVariable Long id) {
        return new ResponseEntity<>(service.changeLikes(id), HttpStatus.OK);
    }

    @GetMapping("/getLikes/{id}")
    public ResponseEntity<Integer> getLikesByGamerId(@PathVariable Long id) {
        return new ResponseEntity<>(service.getLikesById(id), HttpStatus.OK);
    }

    @GetMapping("/isFriend/ida={ida}&idb={idb}")
    public ResponseEntity<Boolean> isFriend(@PathVariable Long ida, @PathVariable Long idb) {
        return new ResponseEntity<>(service.getFriendListById(ida).contains(idb), HttpStatus.OK);

    }







}
