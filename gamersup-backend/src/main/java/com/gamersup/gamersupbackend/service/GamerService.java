package com.gamersup.gamersupbackend.service;

import com.gamersup.gamersupbackend.model.Friends;
import com.gamersup.gamersupbackend.model.profile.GamerSettingsRequest;
import com.gamersup.gamersupbackend.repo.FriendRepository;
import com.gamersup.gamersupbackend.repo.UserRepository;
import com.gamersup.gamersupbackend.service.email_service.email.EmailSender;
import com.gamersup.gamersupbackend.service.email_service.email.EmailValidatorService;
import com.gamersup.gamersupbackend.service.email_service.token.ConfirmationTokenService;
import com.gamersup.gamersupbackend.model.exception.ResourceNotFoundException;
import com.gamersup.gamersupbackend.model.profile.GamerInfo;
import com.gamersup.gamersupbackend.repo.GamerRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.stream.Stream;


@Service
@AllArgsConstructor
public class GamerService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final GamerRepository gamerRepository;
    private final UserRepository userRepository;
    private final ConfirmationTokenService confirmationTokenService;
    private final FriendRepository friendRepository;
    private final EmailValidatorService emailValidator;
    private final EmailSender emailSender;

    public GamerInfo saveGamer(GamerInfo gamer) {
        // Default likes and level
        gamer.setLikes(0);
        gamer.setLevel(0);
        return gamerRepository.save(gamer);
    }

    public List<GamerInfo> getAllGamers() {
        return gamerRepository.findAll();
    }

    public GamerInfo getGamerInfoById(long id) {
        // smarter method
        return gamerRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Gamer", "Id", id)
        );
    }

    public GamerInfo getGamerInfoByEmail(String email) {
        return gamerRepository.findByEmail(email).orElseThrow(() ->
                new ResourceNotFoundException("Gamer", "email", email)
        );
    }

    public GamerInfo updateGamerInfo(GamerSettingsRequest settingsRequest) {
        GamerInfo updatedGamer = gamerRepository.findById(settingsRequest.getUserId()).orElseThrow(() ->
                new ResourceNotFoundException("Gamer", "Id", settingsRequest.getUserId()));
        updatedGamer.setAvatarUrl(settingsRequest.getAvatarUrl());
        updatedGamer.setLevel(settingsRequest.getLevel());
        updatedGamer.setDob(settingsRequest.getDob());
        updatedGamer.setBio(settingsRequest.getBio());
        return gamerRepository.save(updatedGamer);
    }

    public void deleteGamer(String email) {
        gamerRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Gamer", "Email", email));
//        confirmationTokenService.deleteTokenByUserId(id);
        gamerRepository.deleteByEmail(email);
    }

//    public boolean checkGamerExisting(String email, String password) {
//        GamerInfo gamer = gamerRepository.findByEmail(email).get();
//        if (gamer != null) {
//            if (gamer.getPassword().equals(password))
//                return true;
//        }
//        return false;
//    }

//    public GamerInfo getGamerByEmail(String email) {
//        return gamerRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("email", "gamer", email));
//    }

    public Boolean createFriendRequest(long idA, long idB) {
        if (!friendRepository.checkFriendRecord(idA, idB).isPresent()) {
            Friends friendsRecord = new Friends(idA, idB, 0);
            try {
                friendRepository.save(friendsRecord);
                sendAcceptFriendshipMail(gamerRepository.findById(idA).get().getName(),
                        gamerRepository.findById(idB).orElseThrow(() -> new ResourceNotFoundException("Id", "gamer", idB)).getName(),
                        gamerRepository.findById(idB).orElseThrow(() -> new ResourceNotFoundException("Id", "gamer", idB)).getEmail(),
                        idA, idB
                );
                return true;
            } catch (Exception ex) {
                return false;
            }
        } else {
            sendAcceptFriendshipMail(gamerRepository.findById(idA).get().getName(),
                    gamerRepository.findById(idB).orElseThrow(() -> new ResourceNotFoundException("Id", "gamer", idB)).getName(),
                    gamerRepository.findById(idB).orElseThrow(() -> new ResourceNotFoundException("Id", "gamer", idB)).getEmail(),
                    idA, idB
            );
            return true;
        }
    }

    public Boolean acceptFriendRequest(long idA, long idB) {
        if (friendRepository.checkFriendRecord(idA, idB).isPresent()) {
            Friends friendsRecord = friendRepository.findFriendsRecordByIds(idA, idB).orElseThrow(() -> new ResourceNotFoundException("id", "gamer", idA));
            try {
                friendsRecord.setAccepted(1);
                friendRepository.save(friendsRecord);
                System.out.println("Friends " + idA + " And " + idB);
                return true;
            } catch (Exception ex) {
                return false;
            }
        } else {
            sendAcceptFriendshipMail(gamerRepository.findById(idA).get().getName(),
                    gamerRepository.findById(idB).orElseThrow(() -> new ResourceNotFoundException("Id", "gamer", idB)).getName(),
                    gamerRepository.findById(idB).orElseThrow(() -> new ResourceNotFoundException("Id", "gamer", idB)).getEmail(),
                    idA, idB
            );
            return true;
        }
    }

    private boolean sendAcceptFriendshipMail(String nameA, String nameB, String email, long idA, long idB) {
        if (!emailValidator.test(email)) {
            return false;
        }
        System.out.println("Friend request send to " + email);

        emailSender.send(email,
                buildAcceptFriendshipEmail(nameA, nameB, idA, idB));

        return true;
    }

    public List<Long> getFriendListById(Long id) {
        List<Long> tempListA = friendRepository.findGamerAByGamerBAndAccepted(id).orElseThrow(() -> new ResourceNotFoundException("Id", "Gamer", id));
        List<Long> tempListB = friendRepository.findGamerBByGamerAAndAccepted(id).orElseThrow(() -> new ResourceNotFoundException("Id", "Gamer", id));
        return Stream.concat(tempListA.stream(), tempListB.stream()).toList();
    }

    public boolean changeBirthdayById(long id, Date birthday) {
        try {
            GamerInfo gamer = gamerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Id", "Gamer", id));
            gamer.setDob(birthday);
            gamerRepository.save(gamer);
            return true;
        } catch (Exception ex) {
            return false;
        }

    }

    public boolean changeLevel(long id, int level) {
        try {
            GamerInfo gamer = gamerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Id", "Gamer", id));
            gamer.setLevel(level);
            gamerRepository.save(gamer);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public boolean changeLikes(long id) {
        try {
            GamerInfo gamer = gamerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Id", "Gamer", id));
            gamer.setLikes(gamer.getLikes() + 1);
            System.out.println(gamer.getLikes());
            gamerRepository.save(gamer);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public Integer getLikesById(long id) {
        return gamerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Id", "Gamer", id)).getLikes();
    }

    private String buildAcceptFriendshipEmail(String nameA, String nameB, long idA, long idB){
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Someone Invited You!!</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + nameB + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> The gamer " + nameA + " invited you as a friend." + " </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\">" +
                "        \n" + "<a href=\"" + "http://localhost:5252/acceptFriend/" + idA + "&" + idB + "\">Accept</a>" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n"  +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }

    public String getBioById(long id) {
        GamerInfo gamer = gamerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "gamer", id));
        return gamer.getBio();
    }

    public Boolean changeBioById(long id, String bio) {
        GamerInfo gamer = gamerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "gamer", id));
        gamer.setBio(bio);
        if (gamerRepository.save(gamer) != null) {
            return true;
        } else
            return false;
    }

    public Boolean changeAvatarById(long id, String url) {
        GamerInfo gamer = gamerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "gamer", id));
        gamer.setAvatarUrl(url);
        if (gamerRepository.save(gamer) != null) {
            return true;
        } else
            return false;
    }

    public boolean changeAvatarByEmail(String email, String url) {
        try {
            GamerInfo gamer = gamerRepository.findByEmail(email).get();
            gamer.setAvatarUrl(url);
            gamerRepository.save(gamer);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

}
