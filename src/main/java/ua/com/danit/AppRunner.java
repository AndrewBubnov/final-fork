package ua.com.danit;


import javafx.application.Application;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class AppRunner {
  public static void main(String[] args) {
    SpringApplication application = new SpringApplication(AppRunner.class);
    String port = System.getenv("PORT");
    if (port != null) {
      Map<String, Object> map = new HashMap<>();
      map.put("SERVER_PORT", port);
      application.setDefaultProperties(map);
    }
    application.run(args);
  }
}
