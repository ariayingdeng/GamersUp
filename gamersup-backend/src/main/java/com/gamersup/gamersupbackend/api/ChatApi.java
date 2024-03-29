package com.gamersup.gamersupbackend.api;

import com.gamersup.gamersupbackend.audio.Audio;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("api/chatting")
@AllArgsConstructor
@CrossOrigin(origins="http://localhost:5252")
public class ChatApi {
    private HashMap<Long, Audio> audioList;

    @GetMapping("/chat/{id}")
    public void linkToChatRoom(@PathVariable long id) {
        Audio audio = new Audio();
        audio.initAudio();
        audioList.put(id, audio);
    }

    @GetMapping("/stop/{id}")
    public void stopLinkToRoom(@PathVariable long id) {
        audioList.get(id).close();
        audioList.remove(id);
    }

    @GetMapping("/get/{id}")
    public String getLinkToRoom(@PathVariable long id) {
        return audioList.get(id) != null? "On" : "Off";
    }
}
