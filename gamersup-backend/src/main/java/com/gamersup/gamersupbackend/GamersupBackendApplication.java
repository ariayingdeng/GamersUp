package com.gamersup.gamersupbackend;

import com.gamersup.gamersupbackend.audio.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


@SpringBootApplication
//@ComponentScan(basePackages  = {"com.gamersup.gamersupbackend.database"})
public class GamersupBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(GamersupBackendApplication.class, args);
        Server.main(null);
    }

}
