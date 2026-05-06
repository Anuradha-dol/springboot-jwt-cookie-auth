package com.authen.authen.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.media.root-dir:uploads}")
    private String mediaRootDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path mediaRootPath = Paths.get(mediaRootDir).toAbsolutePath().normalize();
        registry.addResourceHandler("/media/**")
                .addResourceLocations(mediaRootPath.toUri().toString());
    }
}
