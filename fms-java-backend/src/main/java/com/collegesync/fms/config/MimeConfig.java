package com.collegesync.fms.config;

import org.springframework.boot.web.server.MimeMappings;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Configuration;

/**
 * Configure MIME mappings so that legacy ASPX webforms paths
 * (such as /AccSoft/studentLogin.aspx) render directly as text/html in all web browsers.
 */
@Configuration
public class MimeConfig implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {

    @Override
    public void customize(ConfigurableServletWebServerFactory factory) {
        MimeMappings mappings = new MimeMappings(MimeMappings.DEFAULT);
        mappings.add("aspx", "text/html;charset=UTF-8");
        mappings.add("html", "text/html;charset=UTF-8");
        mappings.add("js", "application/javascript;charset=UTF-8");
        mappings.add("css", "text/css;charset=UTF-8");
        factory.setMimeMappings(mappings);
    }
}
