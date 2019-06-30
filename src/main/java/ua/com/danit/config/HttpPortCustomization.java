package ua.com.danit.config;

import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.stereotype.Component;

@Component
public class HttpPortCustomization implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {

  @Override
  public void customize(ConfigurableServletWebServerFactory server) {
    String port = System.getenv("PORT");
    if (port != null) {
      server.setPort(Integer.parseInt(port));
    } else {
      server.setPort(9000);
    }
  }
}
